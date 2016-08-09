/**
 * Created by ludovicagodio on 7/29/16.
 */

var imap = require ("imap");
var mailparser = require ("mailparser").MailParser;
var inspect = require('util').inspect;
import {queue} from './DbSync';

var fs = require("fs");
var config = require('./gmail.config.json');
var moment = require('moment');

var server = new imap({
  user: config.username,
  password: config.password,
  host: config.imap.host,
  port: config.imap.port,
  tls:config.imap.secure,
  debug: console.log
});

var timestamp = null;

export function init(t){
  console.log('\n>> Connnecting to IMAP Server...\n\n');
  timestamp = t;
  server.connect();
}

function openInbox(cb) {
  server.openBox('INBOX', true, cb);
}

var exitOnErr = function(err) {
  console.error(err);
  server.end();
}

server.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    timestamp = null;
    var yesterday = moment().subtract(1, 'days').format('MMM DD[,] YYYY');
    var searchOptions = timestamp ? ["UNSEEN", ["SINCE", moment(timestamp).format('MMM DD[,] YYYY')]] : ["ALL", ["SINCE", yesterday]];
    server.search(searchOptions, function(err, results){
      if (err) {
        console.log('\n>> EXITING ON INBOX SEARCH ERROR...\n\n');
        exitOnErr(err);
      }
      if (results && results.length > 0){

        var fetch = server.fetch(results, {
          bodies: ''
        });

        fetch.on('message', function(msg, seqno){

          var parser = new mailparser();


          msg.on('body', function(stream, info) {
            stream.pipe(parser);
          });

          parser.on("end", function(mail_object){
            processMail(mail_object, seqno);
          });

          msg.once('end', function() {
            parser.end();
          });

        });

        fetch.on('end', function(){
          console.log('\n\n>> Done fetching all messages!\n\n');
          generateLeads();
        });

      }
      else {
        console.log('\n>> THERE ARE NOT MESSAGE TO READ\n\n');
        server.end();
        return;
      }
    });

  });
});

server.once('error', function(err) {
  console.log('\n>> EXITING ON SERVER IMAP SERVER ERROR...\n\n');
  exitOnErr(err);
});

server.once('end', function() {
  console.log('Connection ended');
});


var emails = {};
function processMail(mail, msgID){
  var m = {
    from: mail['from'],
    replyTo: mail['replyTo'],
    subject: mail['subject'],
    to: mail['to'],
    date: mail['date'],
    receivedDate: mail['receivedDate'],
    content: mail['text']
  }
  emails[msgID] = parseLead(m);
}

/**
 * Check if Data is XML
 * @param data
 * @returns {boolean}
 */
function isXML(data){
  return data.trim().indexOf('<?xml') != -1;
}

/**
 * Parse email into lead
 * @param mail
 */
function parseLead(mail) {

  /* Lead Model */
  var lead = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    interest: '',
    sourceType: '',
    sourceName: '',
    additionalInfo: '',
    createdAt: '',
  }
  if (isXML(mail.content)) {
    var parseString = require('xml2js').parseString;
    var jsQ = require('json-query');
    parseString(mail.content, function (err, data) {
      if (data) {
        var _l = jsQ('prospect:select(requestdate, requestDate, vehicle, customer, vendor, provider)', {
          data: data.adf,
          locals: {
            select: function (input) {
              if (Array.isArray(input)) {
                var keys = [].slice.call(arguments, 1)
                return input.map(function (item) {
                  return Object.keys(item).reduce(function (result, key) {
                    if (~keys.indexOf(key)) {
                      result[key] = item[key]
                    }
                    return result
                  }, {})
                })
              }
            }
          }
        })
        _l = _l.value[0];
        if (_l.requestdate && _l.requestdate[0]) lead.createdAt = _l.requestdate[0];
        else if (_l.requestDate && _l.requestDate[0]) lead.createdAt = _l.requestDate[0];
        var customer = {};
        var vehicle = {};
        var vendor = {};
        var provider = {};


        if (_l.customer && _l.customer[0]) {
          /**
           * Extract Customer contact Information. {firstName, lastName, phone, email}
           */
          if (_l.customer[0].contact && _l.customer[0].contact[0]) {
            var contact = _l.customer[0].contact[0];
            if (contact.name) {
              for (var i = 0; i < contact.name.length; i++) {
                var name = contact.name[i];
                if (name.$.part == 'first') customer.firstName = name._;
                if (name.$.part == 'last') customer.lastName = name._;
                if (name.$.part == 'full') customer.fullName = name._;
              }
            }
            if (contact.email && contact.email[0]) customer.email = contact.email[0];
            if (contact.phone && contact.phone[0]) customer.phone = contact.phone[0]._;

            if (contact.address && contact.address[0]){
                var addressNode = contact.address[0];
                if (addressNode.street){
                  var address = '';
                  for(var i = 0; i < addressNode.street.length; i++)
                    if (addressNode.street[0]._) address += address.street[0]._+' ';
                  if (addressNode.city && addressNode.city[0]) address += addressNode.city[0]+' ';
                  if (addressNode.postalcode && addressNode.postalcode[0]) address += addressNode.postalcode[0]+' ';
                  address = address.trim();
                  if (address.length > 1) customer.address = address;
                }

            }

          }
          /**
           * Extract Customer comments
           */
          if (_l.customer[0].comments && _l.customer[0].comments[0]) customer.comments = _l.customer[0].comments[0];
        }

        if (_l.vehicle && _l.vehicle[0]){
          var vehicleDetails = _l.vehicle[0];
          if (vehicleDetails.$ && vehicleDetails.$.interest) vehicle.type = vehicleDetails.$.interest;
          if (vehicleDetails.year && vehicleDetails.year[0]) vehicle.year = vehicleDetails.year[0];
          if (vehicleDetails.make && vehicleDetails.make[0]) vehicle.make = vehicleDetails.make[0];
          if (vehicleDetails.model && vehicleDetails.model[0]) vehicle.model = vehicleDetails.model[0];
          if (vehicleDetails.trim && vehicleDetails.trim) vehicle.trim = vehicleDetails.trim[0];
          if (vehicleDetails.odometer && vehicleDetails.odometer[0])
            vehicle.odomoter = vehicleDetails.odometer[0]._ + ' ' + vehicleDetails.odometer[0].$.units;
          if (vehicleDetails.condition && vehicleDetails.condition[0]) vehicle.condition = vehicleDetails.condition[0];
        }

        if (_l.provider && _l.provider[0]){
          var providerDetails = _l.provider[0];
          if (providerDetails.name && providerDetails.name[0]) provider.name = providerDetails.name[0]._;
          if (providerDetails.service && providerDetails.service[0]) provider.service = providerDetails.service[0];
          if (providerDetails.url && providerDetails.url[0]) provider.url = providerDetails.url[0];
        }



          /***
           * Build lead from extracted Info
           */
        if (customer.firstName) lead.firstName = customer.firstName;
        if (customer.lastName) lead.lastName = customer.lastName;
        if (customer.fullName) {
          var ns = customer.fullName.split(' ');
          if (ns.length == 3) {
            lead.firstName = ns[0];
            lead.middleInitial = ns[1];
            lead.lastName = ns[2];
          } else {
            lead.firstName = ns[0];
            lead.lastName = ns[1];
          }
        }
        if (customer.phone) lead.phone = customer.phone;
        if (customer.email) lead.email = customer.email;
        if (customer.address) lead.address = customer.address;
        if (customer.comments) lead.additionalInfo = customer.comments;

        if (Object.keys(vehicle).length > 0) lead.interest = vehicle;
        if (Object.keys(provider).length > 0) lead.sourceType = provider;
        if (provider.name) lead.sourceName = provider.name;

      }
      else {

        //Log for manual input
      }


    });

  }
  else {
    /**
     * Parse Text Data
     */
    var components = mail.content.split('\n');
    var c = [];
    var obj = {};
    for (var i = 0; i < components.length; i++) {
      if (components[i].indexOf(':') != -1) {
        c.push(components[i]);
        var idx = components[i].indexOf(':');
        var key = components[i].substr(0, idx).trim();
        if (key.indexOf('*') == 0) key = key.substr(1);
        var value = components[i].substr(idx + 1).trim();
        obj[key.trim().toLowerCase()] = value;
      }
    }

    var customer = {}, vehicle = {}, provider = {};
    if (obj['first name'] || obj['firstname']) customer.firstName = obj['first name'] || obj['firstname'];
    if (obj['last name'] || obj['lastname']) customer.lastName = obj['lastname'] || obj['last name'];
    if (obj['name'] || obj['fullname']) customer.fullName = obj['name'] || obj['fullname'];
    if (obj['address']) {
      var adr = obj['address'];
      if (obj['city']) adr += ', ' + obj['city'];
      if (obj['st'] || obj['state']) adr += ' ' + (obj['st'] || obj['state']);
      if (obj['zip'] || obj['zip code'] || obj['zipcode'] || obj['postalcode'] || obj['postal code'])
        adr += ' ' + (obj['zip'] || obj['zip code'] || obj['zipcode'] || obj['postalcode'] || obj['postal code']);
      customer.address = adr;
    }
    if (obj['email'] || obj['email address']) customer.email = obj['email'] || obj['email address'];
    if (obj['phone'] || obj['phone number']) customer.phone = obj['phone'] || obj['phone number'];

    if (customer.firstName) lead.firstName = customer.firstName;
    if (customer.lastName)  lead.lastName = customer.lastName;
    if (customer.fullName) {
      var ns = customer.fullName.split(' ');
      if (ns.length == 3) {
        lead.firstName = ns[0];
        lead.middleInitial = ns[1];
        lead.lastName = ns[2];
      }
      else {
        lead.firstName = ns[0];
        lead.lastName = ns[1];
      }
    }
    if (customer.email) lead.email = customer.email;
    if (customer.address) lead.address = customer.address;
    if (customer.phone) lead.phone = customer.phone;

    if (obj['make']) vehicle.make = obj['make'];
    if (obj['model']) vehicle.model = obj['model'];
    if (obj['year']) vehicle.year = obj['year'];
    if (obj['trim'] || obj['trim level'] || obj['trimlevel']) vehicle.trim = obj['trim'] || obj['trim level'] || obj['trimlevel'];
    if (obj['vin'] || obj['vinnumber'] || obj['vin number'] || obj['vin#'] || obj['vin #'])
      vehicle.vin = obj['vin'] || obj['vinnumber'] || obj['vin number'] || obj['vin#'] || obj['vin #'];
    if (obj['stock#'] || obj['stocknumber'] || obj['stock number']) vehicle.stockNumber =
      obj['stock#'] || obj['stocknumber'] || obj['stock number'];
    if (obj['mileage']) vehicle.mileage = obj['mileage'];

    if (Object.keys(vehicle).length > 0) lead.interest = vehicle;

    if (mail.subject) lead.sourceName = mail.subject;
    if (mail.from) lead.sourceType = mail.from;

    lead.additionalInfo = mail.content;
    lead.createdAt = moment(mail.receivedDate);

    if (lead.interest && (!lead.interest.make && !lead.interest.model && !lead.interest.year)) {
      var s = lead.sourceName.split(' ');
      if (s[0].toLowerCase() == 'cars.com') {
        lead.sourceName = 'Cars.com';
        var idx = s.indexOf('-');
        if (idx != -1) {
          lead.interest.year = s[idx + 1];
          lead.interest.make = s[idx + 2];
          lead.interest.model = s[idx + 3];
        }
      }
    }


    if (lead.sourceName.trim().split(' ').length > 1){
      var s = lead.sourceName.toLowerCase().split(' ');
      var cars_com_idx = s.indexOf('cars.com');
      var edmunds_idx = s.indexOf('edmunds');
      var true_car_idx = s.indexOf('truecar');
      var auto_trader_idx = s.indexOf('autotrader');

      if (cars_com_idx != -1) lead.sourceName = 'Cars.com';
      else if (edmunds_idx != -1) lead.sourceName = 'Edmunds';
      else if (true_car_idx != -1) lead.sourceName = 'TrueCar';
      else if (auto_trader_idx != -1) lead.sourceName = 'AutoTrader'
      else {

        cars_com_idx = lead.additionalInfo.trim().toLowerCase().indexOf('cars.com');
        edmunds_idx = lead.additionalInfo.trim().toLowerCase().indexOf('edmunds');
        true_car_idx = lead.additionalInfo.trim().toLowerCase().indexOf('truecar');
        auto_trader_idx = lead.additionalInfo.trim().toLowerCase().indexOf('autotrader');

        if (cars_com_idx != -1) lead.sourceName = 'Cars.com';
        else if (edmunds_idx != -1) lead.sourceName = 'Edmunds';
        else if (true_car_idx != -1) lead.sourceName = 'TrueCar';
        else if (auto_trader_idx != -1) lead.sourceName = 'AutoTrader'
      }

    }

  }
  return lead;
}

function generateLeads() {
  server.end();
  var keys = Object.keys(emails);
  var leads = [];
  for(var k in emails) if (emails.hasOwnProperty(k)) leads.push(emails[k]);
  var ArrayStream = require('arraystream');
  var stream = ArrayStream.create(emails);
  stream.on("data", function(value, key){
    console.log(value);
    if (value.firstName || value.lastName) {
      queue.scheduledAt('Leads', 'GenerateLead', value, function (err, timestamps) {
        if (timestamps.length > 0) {
          return true;
        } else {
          queue.enqueueIn(20000, 'Leads', 'GenerateLead', value, function (err, res) {
            if (err) {
              console.log(err);
              return err;
            }
            console.log('\n\n>> Enqueue Lead(s) For [' + value.firstName + ' , ' + value.lastName + ']');
            return res;
          });
        }
      })
    }
  });

  stream.on("end", function(){
    console.log('stream ended!');
  });

  stream.on('error', function(err){
     console.log(err);
     return err;
  })

}

