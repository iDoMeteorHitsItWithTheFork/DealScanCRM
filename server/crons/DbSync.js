/**
 * Created by ludovicagodio on 7/11/16.
 */

// I am an example of running multiple node-resque workers in a single process, auto-scaling with CPU utilization


var NR = require("node-resque");
var schedule = require('node-schedule');
var Redis = require('ioredis');
var req = require('request');
var StreamArray = require("stream-json/utils/StreamArray");
var Q  = require('q');


import {Dealership} from '../sqldb';
import {User} from '../sqldb';
import {Deal} from '../sqldb';
import {Customer} from '../sqldb';
import {Vehicle} from '../sqldb';
import {Trade} from '../sqldb';

var connectionDetails = { redis: new Redis() };


/////////////////
// DEFINE JOBS //
/////////////////


var i = 0;
var syncDB = function(time){
  var username, password;
  username = password = 'admin';
  var api = 'http://tdealscan.softeq.net:8080/Admin/Dealerships/ExportCustomersToJson';
  time = i > 0 ? Math.floor(time / 1000) : 1451606400; //January 1st 2016
  var params = '?dealershipId=1&since='+time;
  api += params;
  ++i;
  console.log('\n\nAPI: '+api+'\n\n');
  console.log('\n\n******************\n\n');
  var stream = StreamArray.make();

  //Upsert Deals...
  stream.output.on("data", function(object){
    console.log(object.index, object.value);
    console.log('>> Upserting Deal['+object.index+']....');
    var customer = object.value.Customer;
    if (customer.FirstName || customer.LastName){
      return Customer.dscUpsert(customer).then(function(customer){
        var deals = object.value.Deals;
        var _deals = [];
        for(var i = 0; i < deals.length; i++) {
           if (!deals[i].SalesPersonId ||!deals[i].SalesPersonFirstName || !deals[i].SalesPersonLastName){
              console.log('\n\n Deal['+deals[i].DealId+'] ignored because of No SalePerson Info');
           } else _deals.push(Deal.dscUpsert(deals[i], customer));
        }
        return Q.all(_deals).then(function(deals){
          console.log('>> Deal(s) Upserted!');
          return deals;
        }).catch(function(err){
            console.log(err);
            return err;
        });
      }).catch(function(err){
          console.log(err);
          return err;
      })
    } else console.log('Customer['+customer.CustomerId+'] Data Ignored because of no firstname or lastname');
  });

  stream.output.on("end", function(){
    console.log(">> Database Syncing Completed.");
  });

  req.get(api)
    .auth(username, password, false)
    .on('error', function(err){
      console.log(err);
    }).pipe(stream.input || []);

};




var jobs = {
  "SyncDB": {
    plugins: [],
    pluginOptions: {},
    perform: function(time, callback){
      var start = time;
      callback(null, syncDB(start));
    },
  },
};


var start = function () {

  ///////////////////////
  // START A SCHEDULER //
  ///////////////////////

  var scheduler = new NR.scheduler({connection: connectionDetails});
  scheduler.connect(function () {
    scheduler.start();
    ////////////////////
    // START A WORKER //
    ////////////////////
    var worker = new NR.worker({connection: connectionDetails, queues: ['DBSync']}, jobs);
    worker.connect(function () {
      worker.workerCleanup(); // optional: cleanup any previous improperly shutdown workers on this host
      worker.start();
    });



    /////////////////////////
    // REGESTER FOR EVENTS //
    /////////////////////////


    worker.on('start',           function(){ console.log("worker started"); });
    worker.on('end',             function(){ console.log("worker ended"); });
    worker.on('cleaning_worker', function(worker, pid){ console.log("cleaning old worker " + worker); });
    worker.on('poll',            function(queue){ console.log("worker polling " + queue); });
    worker.on('job',             function(queue, job){ console.log("working job " + queue + " " + JSON.stringify(job)); });
    worker.on('reEnqueue',       function(queue, job, plugin){ console.log("reEnqueue job (" + plugin + ") " + queue + " " + JSON.stringify(job)); });
    worker.on('success',         function(queue, job, result){ console.log("job success " + queue + " " + JSON.stringify(job) + " >> " + result); });
    worker.on('failure',         function(queue, job, failure){ console.log("job failure " + queue + " " + JSON.stringify(job) + " >> " + failure); });
    worker.on('error',           function(queue, job, error){ console.log("error " + queue + " " + JSON.stringify(job) + " >> " + error); });
    worker.on('pause',           function(){ console.log("worker paused"); });


    scheduler.on('start',             function(){ console.log("scheduler started"); });
    scheduler.on('end',               function(){ console.log("scheduler ended"); });
    scheduler.on('poll',              function(){ console.log("scheduler polling"); });
    scheduler.on('master',            function(state){ console.log("scheduler became master"); });
    scheduler.on('error',             function(error){ console.log("scheduler error >> " + error); });
    scheduler.on('working_timestamp', function(timestamp){ console.log("scheduler working timestamp " + timestamp); });
    scheduler.on('transferred_job',   function(timestamp, job){ console.log("scheduler enquing job " + timestamp + " >> " + JSON.stringify(job)); });



  });


  /////////////////
  // ENQUEUE TASKS //
  /////////////////

  var queue = new NR.queue({connection: connectionDetails}, jobs);
  queue.on('error', function (error) {
    console.log(error);
  });
  queue.connect(function () {

    queue.cleanOldWorkers(5000, (err, data) => {
      if (Object.keys(data).length > 0) console.log('cleaned old workers')
    });

    schedule.scheduleJob('10,20,30,40,50 * * * * *', function () { // do this job every 10 seconds, cron style
      // we want to ensure that only one instance of this job is scheduled in our enviornment at once,
      // no matter how many schedulers we have running
      if (scheduler.master) {
        console.log(">>> enquing a job");
        queue.enqueue('DBSync', "SyncDB", new Date().getTime());
      }
    });
  });

}


//////////////////////
// SHUTDOWN HELPERS //
//////////////////////

var stop = function(){
  scheduler.end(function(){
    worker.end(function(){
      console.log('bye.');
      process.exit();
    });
  });
};

process.on('SIGTERM', stop);
process.on('SIGINT', stop);


export {start}







///////////////////
// ENQUEUE TASKS //
///////////////////

// var queue = new NR.queue({connection: connectionDetails}, jobs);
// queue.connect(function(){
//   var i;
//   i = 0;
//   while(i < 10){
//     queue.enqueue('DBSync', "SyncDB", []);
//     i++;
//   }
// });

//////////
// WORK //
//////////

//
// var multiWorker = new NR.multiWorker({
//   connection: connectionDetails,
//   queues: ['DBSync'],
// }, jobs);
//
// // normal worker emitters
// multiWorker.on('start',             function(workerId){                      console.log("worker["+workerId+"] started"); });
// multiWorker.on('end',               function(workerId){                      console.log("worker["+workerId+"] ended"); });
// multiWorker.on('cleaning_worker',   function(workerId, worker, pid){         console.log("cleaning old worker " + worker); });
// multiWorker.on('poll',              function(workerId, queue){               console.log("worker["+workerId+"] polling " + queue); });
// multiWorker.on('job',               function(workerId, queue, job){          console.log("worker["+workerId+"] working job " + queue + " " + JSON.stringify(job)); });
// multiWorker.on('reEnqueue',         function(workerId, queue, job, plugin){  console.log("worker["+workerId+"] reEnqueue job (" + plugin + ") " + queue + " " + JSON.stringify(job)); });
// multiWorker.on('success',           function(workerId, queue, job, result){  console.log("worker["+workerId+"] job success " + queue + " " + JSON.stringify(job) + " >> " + result); });
// multiWorker.on('failure',           function(workerId, queue, job, failure){ console.log("worker["+workerId+"] job failure " + queue + " " + JSON.stringify(job) + " >> " + failure); });
// multiWorker.on('error',             function(workerId, queue, job, error){   console.log("worker["+workerId+"] error " + queue + " " + JSON.stringify(job) + " >> " + error); });
// multiWorker.on('pause',             function(workerId){                      console.log("worker["+workerId+"] paused"); });
//
// // multiWorker emitters
// multiWorker.on('internalError',     function(error){                         console.log(error); });
// multiWorker.on('multiWorkerAction', function(verb, delay){                   console.log("*** checked for worker status: " + verb + " (event loop delay: " + delay + "ms)"); });
//
// multiWorker.start();
//
//
// process.on('SIGINT', function(){
//   multiWorker.stop(function(){
//     process.exit();
//   });
// });
