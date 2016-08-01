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
          var fds = {}
          var filenames = {}
          var parser = new mailparser();

          var prefix = '(#' + seqno + ') ';
          //console.log('Message #%d', seqno);

          msg.on('body', function(stream, info) {
           // console.log(prefix + 'Body');
            stream.pipe(parser);
          });

          parser.on("end", function(mail_object){
            processMail(mail_object);
          });

          msg.once('end', function() {
            //console.log(prefix + 'Finished');
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
  return data.indexOf('<?xml version') != -1;
}

/**
 * Parse email into lead
 * @param mail
 */
function parseLead(mail){
  if (isXML(mail.content)) {
    var parseString = require('xml2js').parseString;
    console.log(mail.content);
    parseString(mail.content, function (err, result) {
      console.log(inspect(JSON.stringify(result), false, null));
    });

  } else {



  }

  var lead = {
    firstName:'',
    lastName: '',
    phone: '',
    email:'',
    address: '',
    interest: '',
    sourceType: '',
    sourceName: '',
    additionalInfo: '',
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
