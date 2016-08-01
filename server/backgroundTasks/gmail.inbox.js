/**
 * Created by ludovicagodio on 7/29/16.
 */

var imap = require ("imap");
var mailparser = require ("mailparser").MailParser;
var inspect = require('util').inspect;

var fs = require("fs");
var config = require('./gmail.config.json');

var server = new imap({
  user: config.username,
  password: config.password,
  host: config.imap.host,
  port: config.imap.port,
  tls:config.imap.secure,
  debug: console.log
});

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
    server.search(["ALL", ["SINCE", "Sep 18, 2011"]], function(err, results){
      if (err) {
        console.log('\n>> EXITING ON INBOX SEARCH ERROR...');
        exitOnErr(err);
      }
      if (results && results.length > 0){

        var fetch = server.fetch(results, {
          bodies: ''
        });

        fetch.on('message', function(msg, seqno){

          var parser = new mailparser();
          var prefix = '(#' + seqno + ') ';


          msg.on('body', function(stream, info) {
            stream.pipe(parser);
          });

          parser.on("end", function(mail_object){
            processMail(mail_object);
          });

          msg.once('end', function() {
            parser.end();
          });

        });

        fetch.on('end', function(){
          console.log('Done fetching all messages!');
          displayMails();
        });

      }
      else {
        console.log('>> THERE ARE NOT MESSAGE TO READ');
        server.end();
        return;
      }
    });

  });
});

server.once('error', function(err) {
  console.log('\n>> EXITING ON SERVER IMAP SERVER ERROR...');
  exitOnErr(err);
});

server.once('end', function() {
  console.log('Connection ended');
});


var emails = [];
function processMail(mail){
  console.log('\n>> Processing EMAIL...');
  //console.log(mail);
  var m = {
    from: mail['from'],
    replyTo: mail['replyTo'],
    subject: mail['subject'],
    to: mail['to'],
    date: mail['date'],
    receivedDate: mail['receivedDate'],
    content: mail['text']
  }
  emails.push(parseLead(m));
  console.log('\n\n ***********************\n\n');
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
    console.log(mail.content);
  }
  return lead;
}

function displayMails(){
  console.log(emails);
  server.end();
}

function init(){
  console.log('\n>> Connnecting to IMAP Server...');
  server.connect();
}


export {init}
