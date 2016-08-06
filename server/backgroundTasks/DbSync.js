/**
 * Created by ludovicagodio on 7/11/16.
 */

// I am an example of running multiple node-resque workers in a single process, auto-scaling with CPU utilization


var NR = require("node-resque");
var schedule = require('node-schedule');
var Redis = require('ioredis');
var req = require('request');
var Q  = require('q');
var Promise = require('bluebird');
Promise.promisifyAll(NR);
var StreamArray = require("stream-json/utils/StreamArray");
var Inbox = require('./gmail.inbox');
var moment = require('moment');

import {Dealership} from '../sqldb';
import {User} from '../sqldb';
import {Deal} from '../sqldb';
import {Customer} from '../sqldb';
import {Vehicle} from '../sqldb';
import {Trade} from '../sqldb';
import {Lead} from '../sqldb';


var connectionDetails = { redis: new Redis() };
var jobs = {
  "SyncDB": {
    plugins: [],
    pluginOptions: {},
    perform: function(time, callback){
      var start = time;
      fetchData(start);
      callback(null, 'API -> fetch data in : '+(new Date().getTime() - start)+' (ms)');
    },
  },
  "FetchEmails": {
    plugins: [],
    pluginOptions: {},
    perform: function(time, callback){
      var start = time;
      Inbox.init(start);
      callback(null, 'IMAP -> fetch mails in : '+(new Date().getTime() - start)+' (ms)');
    },
  },
  "ProcessData": {
    plugins: [],
    pluginOptions: {
      retry: {
        retryLimit: 3,
        retryDelay: (1000 * 5),
      }
    },
    perform: function(deal, callback){
       console.log('\n\n>> Processing Lead...');
       setTimeout(function(){
         syncDeal(deal, callback);
       },1000);
    },
  },
  "GenerateLead": {
    plugins: [],
    pluginOptions: {
      retry: {
        retryLimit: 3,
        retryDelay: (1000 * 5),
      }
    },
    perform: function(lead, callback){
      console.log('\n\n>> Generating Lead...');
      setTimeout(function(){
        insertLead(lead, callback);
      },1000);
    },
  },
};

var queue = new NR.queue({ connection:connectionDetails }, jobs);


/////////////////
// DEFINE JOBS //
/////////////////

var syncDeal = function(deal, callback){
    console.log('\n\n\n\>> Syncing Deal...\n\n');
    var _customer = deal.Customer;
    var custDeals = deal.Deals;
    return Customer.dscUpsert(_customer).then(function (customer) {
      if (customer && custDeals.length > 0) {
        var _promises = [];
        for (var i = 0; i < custDeals.length; i++) {
          if (!custDeals[i].SalesPersonId || !custDeals[i].SalesPersonFirstName || !custDeals[i].SalesPersonLastName) {
            console.log('\n\n Deal[' + custDeals[i].DealId + '] ignored because of No SalePerson Info');
          } else _promises.push(Deal.dscUpsert(custDeals[i], customer));
        }
        return Q.all(_promises).then(function (syncResults) {
          if (syncResults) console.log('\n>> Customer(' + _customer.CustomerId + ')(' + _customer.FirstName + ' ' + _customer.LastName + ') Deals Upserted.');
          callback(null, syncResults);
        }).catch(function (err) {
          console.log(err);
          callback(err);
        });
      } else {
        console.log('\n\n\n\n NO DEALS TO PROCESS \n\n\n');
        callback(null, customer);
      }
    }).catch(function (err) {
      console.log(err);
      callback(err);
    });
}

/**
 * Insert Lead
 * @param lead
 * @param callback
 */
var insertLead = function(lead, callback){
  console.log(lead);
  return Lead.sequelize.transaction(function (t) {
    console.log('\n\n>> Finding System');
    return User.find({
      where: {
        firstName: 'System',
        lastName: 'Automaton'
      },
      transaction: t
    }).then(function(user){
       var creator = user;
       console.log('\n\n>> Finding Dealership');
       return Dealership.find({
         where: {
           dealershipName: 'Hagerstown Ford'
         },
         transaction: t
       }).then(function(dealership){
          var dealership = dealership;
          console.log('\n\n>> Upserting Lead..');
          return Lead.dscUpsert(lead, t)
            .then(function(_lead){
             console.log('\n\n>> Adding Creator...');
             return _lead.setCreator(creator, {transaction: t})
               .then(function(){
                   console.log('\n\n>> Setting Dealership....');
                   return _lead.setDealership(dealership, {transaction: t})
                     .then(function(){
                      console.log('\n\n>> Lead created!');
                      return _lead;
                   });
             })
          });
       })
    }).then(function(l){
        console.log('\n>> Lead inserted!\n\n');
        callback(null, l);
        return l;
    });
  }).catch(function(err){
       console.log(err);
       callback(err);
    });
}

var extractDataToSync = function (dbRecords) {
  console.log('\n\n\n>> DB Records....');
  //console.log(dbRecords);
  if (!dbRecords || dbRecords.length == 0) return true;
  var _dealsToProcess = [];
  var _custCount = 0, _dealsCount =0;
  for (var i = 0; i < dbRecords.length; i++) {
    if ((dbRecords[i].Customer.FirstName || dbRecords[i].Customer.LastName)) {
      _dealsToProcess.push(dbRecords[i]);
      _custCount++;
      _dealsCount += dbRecords[i].Deals.length;
    }
  }
  console.log("\n\n>> Customers To Process: "+_custCount);
  console.log("\n>> Deals to Process: "+_dealsCount);
  return _dealsToProcess;
}

var i = 0;
var fetchData = function(time) {
  var username, password;
  username = password = 'admin';
  var api = 'http://tdealscan.softeq.net:8080/Admin/Dealerships/ExportCustomersToJson';
  var yesterday = moment().subtract(1, 'days').unix();
  time = i > 0 ? Math.floor(time / 1000) : yesterday; //January 1st 2016
  var params = '?dealershipId=1&since=' + time;
  api += params;
  ++i;
  console.log('\n\nAPI: ' + api + '\n\n');
  console.log('\n\n******************\n\n');

  var data = [];
  var stream = StreamArray.make();

  req.get(api)
    .auth(username, password, false)
    .on('error', function(err){
      console.log(err);
    }).pipe(stream.input || []);

  /* */

  stream.output.on("data", function(object){
    data.push(object.value);
    if (object.value.Customer.FirstName || object.value.Customer.LastName){
      queue.scheduledAt('DBSync', 'ProcessData', object.value, function(err, timestamps){
        if (timestamps.length > 0){
          return true;
        } else {
          queue.enqueueIn(20000, 'DBSync', 'ProcessData', object.value, function(err, res){
            if (err){
              console.log(err);
              return err;
            }
            console.log('\n\n>> Enqueue Deal(s) For Customer['+object.value.Customer.CustomerId+']');
            return res;
          });
        }
      })
    }
  });

  stream.output.on("end", function(){
     extractDataToSync(data);
  });

};






var worker = null;
var scheduler = new NR.scheduler({connection: connectionDetails});

var start = function () {

  ///////////////////////
  // START A SCHEDULER //
  ///////////////////////

  scheduler.connect(function () {
    scheduler.start();
    ////////////////////
    // START A WORKER //
    ////////////////////

    worker = new NR.multiWorker({
      connection: connectionDetails,
      queues: ['DBSync', 'Leads'],
      minTaskProcessors: 1,
      maxTaskProcessors: 15,
    }, jobs);

    /////////////////////////
    // REGESTER FOR EVENTS //
    ////////////////////////
    worker.on('start',             function(workerId){                      console.log("worker["+workerId+"] started"); });
    worker.on('end',               function(workerId){                      console.log("worker["+workerId+"] ended"); });
    worker.on('cleaning_worker',   function(workerId, worker, pid){         console.log("cleaning old worker " + worker); });
    worker.on('poll',              function(workerId, queue){               console.log("worker["+workerId+"] polling " + queue); });
    worker.on('job',               function(workerId, queue, job){          console.log("worker["+workerId+"] working job " + queue + " " + JSON.stringify(job)); });
    worker.on('reEnqueue',         function(workerId, queue, job, plugin){  console.log("worker["+workerId+"] reEnqueue job (" + plugin + ") " + queue + " " + JSON.stringify(job)); });
    worker.on('success',           function(workerId, queue, job, result){  console.log("worker["+workerId+"] job success " + queue + " " + JSON.stringify(job) + " >> " + result); });
    worker.on('failure',           function(workerId, queue, job, failure){ console.log("worker["+workerId+"] job failure " + queue + " " + JSON.stringify(job) + " >> " + failure); });
    worker.on('error',             function(workerId, queue, job, error){   console.log("worker["+workerId+"] error " + queue + " " + JSON.stringify(job) + " >> " + error); });
    worker.on('pause',             function(workerId){                      console.log("worker["+workerId+"] paused"); });

    // multiWorker emitters
    worker.on('internalError',     function(error){                         console.log(error); });
    worker.on('multiWorkerAction', function(verb, delay){                   console.log("*** checked for worker status: " + verb + " (event loop delay: " + delay + "ms)"); });

    worker.start();


    scheduler.on('start',             function(){ console.log("scheduler started"); });
    scheduler.on('end',               function(){ console.log("scheduler ended"); });
    scheduler.on('poll',              function(){ console.log("scheduler polling"); });
    scheduler.on('master',            function(state){ console.log("scheduler became master"); });
    scheduler.on('error',             function(error){ console.log("scheduler error >> " + error); });
    scheduler.on('working_timestamp', function(timestamp){ console.log("scheduler working timestamp " + timestamp); });
    scheduler.on('transferred_job',   function(timestamp, job){ console.log("scheduler enquing job " + timestamp + " >> " + JSON.stringify(job)); });

  });


  queue.connect(() => {
    queue.cleanOldWorkers(5000, (err, data) => {
      if (Object.keys(data).length > 0) console.log('cleaned old workers')
    })

    schedule.scheduleJob('*/15 * * * *', () => {
      if (scheduler.master) {
        queue.enqueue('DBSync', 'SyncDB', (new Date()).getTime());
        console.log('\n\n\n>> Enqueued SyncDB...');
      }
    })

    schedule.scheduleJob('*/5 * * * *', () => {
      if (scheduler.master) {
        queue.enqueue('Leads', 'FetchEmails', (new Date()).getTime());
        console.log('\n\n\n>> Enqueued FetchEmails...');
      }
    })


  })

}

//////////////////////
// SHUTDOWN HELPERS //
//////////////////////

var stop = function() {
  if (scheduler && worker) {
    scheduler.end(function () {
      worker.end(function () {
        console.log('bye.');
        process.exit();
      });
    });
  }
};

process.on('SIGTERM', stop);
process.on('SIGINT', stop);


export {start}
export {queue}


