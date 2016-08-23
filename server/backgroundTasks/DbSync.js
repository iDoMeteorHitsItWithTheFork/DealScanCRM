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
var inspect = require('util').inspect;

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
       console.log('\n\n>> Processing Deal...');
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
    var _customer = deal;
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
    console.log('\n\n>> Retreiving System Details');
    return User.find({
      where: {
        firstName: 'EMAIL',
        lastName: 'SYSTEM'
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

var sqlStatement = function(today){
  if (!today) today = moment().startOf('day'); //moment().startOf('month').startOf('day');
  return "SELECT " +
    "[DL].[DealId]," +
    "[DL].[DealershipId]," +
    "[DL].[CustomerId]," +
    "[DL].[VehicleId]," +
    "[DL].[TradeId]," +
    "[DL].[RetailValue]," +
    "[DL].[SalesPrice]," +
    "[DL].[DownPayment]," +
    "[DL].[SalesPersonId]," +
    "[PMT].[DealId]," +
    "[PMT].[PaymentOptionId]," +
    "[PMT].[isLeasePayment]," +
    "[PMT].[Term]," +
    "[PMT].[Rate]," +
    "[PMT].[Payment]," +
    "[PMT].[Selected]," +
    "[DL].[SalesPersonFirstName]," +
    "[DL].[SalesPersonLastName]," +
    "[DL].[SalesManagerId]," +
    "[DL].[SalesManagerFirstName]," +
    "[DL].[SalesManagerLastName]," +
    "[DL].[TradeValue]," +
    "[DL].[DealStatusTypeName]," +
    "[DL].[Rebates]," +
    "[DL].[DateCreated]," +
    "[DL].[DateStatusChanged]," +
    "[DL].[DatePostedToADP]," +
    "[DL].[DealershipName]," +
    "[DL].[DealershipZip]," +
    "[DL].[CustomerZip]," +
    "[DL].[VehicleUpdateDate]," +
    "[DL].[CustomerUpdateDate]," +
    "[DL].[MarketingTypeName]," +
    "[CST].[CustomerId]," +
    "[CST].[FirstName]," +
    "[CST].[MiddleInitial]," +
    "[CST].[LastName]," +
    "[CST].[FullName]," +
    "[CST].[AddressLine1]," +
    "[CST].[AddressLine2]," +
    "[CST].[City]," +
    "[CST].[StateName]," +
    "[CST].[StateCode]," +
    "[CST].[PostalCode]," +
    "[CST].[Birthday]," +
    "[CST].[DateCreated]," +
    "[CST].[PhoneNumber]," +
    "[CST].[EmailAddress],"+
    "[CST].[DriversLicenseNo]," +
    "[CST].[DealershipId]," +
    "[CB].[FirstName] AS CoBuyerFirstName,"+
    "[CB].[MiddleInitial] AS CoBuyerMiddleInitial,"+
    "[CB].[LastName] AS CoBuyerLastName,"+
    "[CB].[AddressLine1] AS CoBuyerAddressLine1,"+
    "[CB].[AddressLine2] AS CoBuyerAddressLine2,"+
    "[CB].[City] AS CoBuyerCity,"+
    "[CB].[PostalCode] AS CoBuyerPostalCode,"+
    "[CB].[Birthday] AS CoBuyerBirthday,"+
    "[CB].[DateCreated] AS CoBuyerDateCreated,"+
    "[CB].[DriversLicenseNo] AS CoBuyerDriversLicenseNo,"+
    "[CB].[EmailAddress] AS CoBuyerEmailAddress,"+
    "[CB].[PhoneNumber] AS CoBuyerPhoneNumber,"+
    "[DLTRD].[TradeId]," +
    "[DLTRD].[ActualCashValue]," +
    "[DLTRD].[BalanceOwed]," +
    "[DLTRD].[VehicleId]," +
    "[DLTRD].[ScanDate]," +
    "[TRDVHL].[VehicleId] AS TradeVehicleId," +
    "[TRDVHL].[VIN] AS TradeVIN," +
    "[TRDVHL].[Color] AS TradeColor," +
    "[TRDVHL].[DateCreated] AS TradeDateCreated," +
    "[TRDVHL].[Year] AS TradeYear," +
    "[TRDVHL].[Make] AS TradeMake," +
    "[TRDVHL].[Model] AS TradeModel," +
    "[TRDVHL].[Mileage] AS TradeMileage," +
    "[TRDVHL].[BodyStyle] AS TradeBodyStyle," +
    "[VHL].[VehicleId],[VHL].[DealershipId]," +
    "[VHL].[VIN],[VHL].[StockNumber]," +
    "[VHL].[Color]," +
    "[VHL].[Invoice]," +
    "[VHL].[HoldBack]," +
    "[VHL].[HardPack]," +
    "[VHL].[Pack]," +
    "[VHL].[Retail]," +
    "[VHL].[New]," +
    "[VHL].[DateCreated]," +
    "[VHL].[NetCost]," +
    "[VHL].[BaseCost]," +
    "[VHL].[GrossCost]," +
    "[VHL].[FullRetail]," +
    "[VHL].[BodyStyle]," +
    "[VHL].[Year]," +
    "[VHL].[Make]," +
    "[VHL].[Model]," +
    "[VHL].[Mileage] " +
    "FROM [KelCar.DeskingSuite].Deal.DealView DL" +
    " INNER JOIN [KelCar.DeskingSuite].Customer.CustomerView CST ON DL.CustomerId = CST.CustomerId " +
    "LEFT OUTER JOIN [KelCar.DeskingSuite].Deal.CoBuyer CB ON DL.DealId = CB.DealId "+
    "INNER JOIN [KelCar.DeskingSuite].Vehicle.VehicleView VHL ON DL.VehicleId =  VHL.VehicleId " +
    "INNER JOIN [KelCar.DeskingSuite].Deal.PaymentOption PMT ON PMT.DealId = DL.DealId " +
    "LEFT OUTER JOIN [KelCar.DeskingSuite].Deal.Trade DLTRD ON DL.TradeId = DLTRD.TradeId " +
    "LEFT OUTER JOIN [KelCar.DeskingSuite].Vehicle.VehicleView TRDVHL ON TRDVHL.VehicleId = DLTRD.VehicleId " +
    "WHERE CST.FullName IS NOT NULL AND CST.FullName != '' AND " +
    "(DL.DateCreated >= '"+today.format("MM/DD/YYYY HH:mm:ss a")+"' OR DL.DateStatusChanged >= '"+today.format("MM/DD/YYYY HH:mm:ss a")+"') " +
    "AND PMT.Selected = 1 " +
    "ORDER BY DL.DealId DESC, PMT.PaymentOptionId DESC ";
}

var executeStatement = function(connection) {
  var Request = require('tedious').Request;
  var statement = sqlStatement();
  var results = [];
  var sql = new Request(statement, function(err, rowCount) {
    if (err){
      console.log(err);
      return err;
    } else {
      console.log('\n\n\n\n QUERY \n\n\n');
      console.log('RESULTS: '+rowCount);
      results = formatResults(results);
      console.log('\n\n\n ***************** \n\n\n');
      var ArrayStream = require('arraystream');
      var data = results;
      if (data.length > 0) {
        var stream = ArrayStream.create(data);
        var i = 0;
        stream.on("data", function (value, key) {
          console.log('\n\n >> Customer ('+(++i)+')');
          console.log(value);
          queue.scheduledAt('DBSync', 'ProcessData', value, function (err, timestamps) {
            if (timestamps.length > 0) {
              return true;
            } else {
              queue.enqueueIn(20000, 'DBSync', 'ProcessData', value, function (err, res) {
                if (err) {
                  console.log(err);
                  return err;
                }
                console.log('\n\n>> Enqueue Deal(s) For Customer[' +value.CustomerId + ']');
                return res;
              });
            }
          })

        });

        stream.on("end", function () {
          console.log('\n\n>> Stream Ended!');
        });

      } else {
        console.log('\n\n>> No Records To Process...End');
      }
    }
    connection.close();
  });

  sql.on('row', function(columns) {
    var r = {};
    for(var col in columns) r[col] = columns[col].value;
    results.push(r);
  });

  sql.on('done', function(rowCount, more) {
    console.log('\n\n\n\n\n\n DONE \n\n\n\n\n');
    console.log(rowCount + ' rows returned');
    console.log('\n\n\n\n ____________ \n\n\n\n');
  });

  connection.execSql(sql);

}


var formatResults = function (results) {
  var customers = {};
  for (var i = 0; i < results.length; i++) {
    var deal = results[i];
    var customer = {};
    customer = customers.hasOwnProperty(deal.CustomerId) && customers[deal.CustomerId] ? customers[deal.CustomerId] : {
      CustomerId: deal.CustomerId,
      FirstName: deal.FirstName,
      MiddleInitial: deal.MiddleInitial,
      LastName: deal.LastName,
      FullName: deal.FullName,
      AddressLine1: deal.AddressLine1,
      AddressLine2: deal.AddressLine2,
      PhoneNumbver: deal.PhoneNumber,
      EmailAddress: deal.EmailAddress,
      City: deal.City,
      StateName: deal.StateName,
      StateCode: deal.StateCode,
      PostalCode: deal.PostalCode,
      Birthday: deal.Birthday,
      DriversLicenseNo: deal.DriversLicenseNo,
      MarketingTypeName: deal.MarketingTypeName,
      CustomerUpdateDate: deal.CustomerUpdateDate,
      Deals: []
    };

    var proceed = true;
    if (customer.Deals.length > 0){
      for(var k=0; k < customer.Deals.length; k++){
        if (deal.DealId == customer.Deals[k].DealId
          && customer.Deals[k].SelectedPaymentOption.PaymentOptionId > deal.PaymentOptionId) {
          proceed = false;
          break;
        }
      }
    }

    if (proceed){

      var custDeal = {

        DealId: deal.DealId,
        DealershipId: deal.DealershipId,
        DealershipName: deal.DealershipName,
        DealershipZip: deal.DealershipZip,
        SalesPersonId: deal.SalesPersonId,
        SalesPersonFirstName: deal.SalesPersonFirstName,
        SalesPersonLastName: deal.SalesPersonLastName,
        SalesManagerId: deal.SalesManagerId,
        SalesManagerFirstName: deal.SalesManagerFirstName,
        SalesManagerLastName: deal.SalesManagerLastName,
        RetailValue: deal.RetailValue,
        SalesPrice: deal.SalesPrice,
        SelectedPaymentOption: {
          PaymentOptionId: deal.PaymentOptionId,
          DownPayment: deal.DownPayment,
          isLeasePayment: deal.isLeasePayment,
          Term: deal.Term,
          Rate: deal.Rate,
          Payment: deal.Payment,
        },
        Vehicle: {
          VehicleId: deal.VehicleId,
          VehicleUpdateDate: deal.VehicleUpdateDate,
          VIN: deal.VIN,
          StockNumber: deal.StockNumber,
          Color: deal.Color,
          Invoice: deal.Invoice,
          HoldBack: deal.HoldBack,
          HardPack: deal.HardPack,
          Pack: deal.Pack,
          Retail: deal.Retail,
          New: deal.New,
          NetCost: deal.NetCost,
          BaseCost: deal.BaseCost,
          GrossCost: deal.GrossCost,
          FullRetail: deal.FullRetail,
          BodyStyle: deal.BodyStyle,
          Year: deal.Year,
          Make: deal.Make,
          Model: deal.Model,
          Mileage: deal.Mileage
        },
        DealStatusTypeName: deal.DealStatusTypeName,
        Rebates: deal.Rebates,
        DateCreated: deal.DateCreated,
        DateStatusChanged: deal.DateStatusChanged,
        DatePostedToADP: deal.DatePostedToADP,
      };
      if (deal.TradeId) {
        custDeal.Trades = {
          TradeId: deal.TradeId,
          TradeValue: deal.TradeValue,
          ActualCashValue: deal.ActualCashValue,
          BalanceOwed: deal.BalanceOwed,
          VehicleID: deal.TradeVehicleId,
          VIN: deal.TradeVIN,
          Color: deal.TradeColor,
          DateCreated: deal.TradeDateCreated,
          Year: deal.TradeYear,
          Make: deal.TradeMake,
          Model: deal.TradeModel,
          Mileage: deal.TradeMileage,
          BodyStyle: deal.TradeBodyStyle,
        }
      }

      if (deal.CoBuyerFirstName || deal.CoBuyerLastName) {
        custDeal.CoBuyer = {
          FirstName: deal.CoBuyerFirstName,
          MiddleInitial: deal.CoBuyerMiddleInitial,
          LastName: deal.CoBuyerLastName,
          AddressLine1: deal.CoBuyerAddressLine1,
          AddressLine2: deal.CoBuyerAddressLine2,
          City: deal.CoBuyerCity,
          PostalCode: deal.CoBuyerPostalCode,
          Birthday: deal.CoBuyerBirthday,
          DateCreated: deal.CoBuyerDateCreated,
          DriversLicenseNo: deal.CoBuyerDriversLicenseNo,
          EmailAddress: deal.CoBuyerEmailAddress,
          PhoneNumber: deal.CoBuyerPhoneNumber
        }
      }
      customer.Deals.push(custDeal);
    }
    customers[deal.CustomerId] = customer;
  }

  return Object.values(customers);
}


var fetchData = function (time) {

  var Connection = require('tedious').Connection;
  var config = require('./dscDbConfig.json');
  var connection = new Connection(config);
  connection.on('connect', function (err) {
      if (err) {
        console.log(err);
        return err;
      } else {
        executeStatement(connection, time);
      }
    }
  );

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
      maxTaskProcessors: 10,
      checkTimeout: 500,
      maxEventLoopDelay:5,
      toDisconnectProcessors: true
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

    schedule.scheduleJob('*60 * * * *', () => {
      if (scheduler.master) {
        queue.enqueue('DBSync', 'SyncDB', (new Date()).getTime());
        console.log('\n\n\n>> Enqueued SyncDB...\n\n\n\n');
        console.log('****************************\n\n');
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


function fetchEmails(){
  Inbox.init();
}

export {start}
export {queue}
export {fetchData}
export {fetchEmails}


