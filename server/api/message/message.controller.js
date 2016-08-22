/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/messages              ->  index
 * POST    /api/messages              ->  create
 * GET     /api/messages/:id          ->  show
 * PUT     /api/messages/:id          ->  update
 * DELETE  /api/messages/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Message} from '../../sqldb';

var imap = require ("imap");
var mailparser = require ("mailparser").MailParser;
var inspect = require('util').inspect;

var fs = require("fs");
var moment = require('moment');


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log(err);
    throw err;
    res.status(statusCode).send(err);
  };
}

// Gets a list of Messages
export function index(req, res) {
  syncMails("testdscrm@gmail.com");
  Message.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Message from the DB
export function show(req, res) {
  Message.find({
    where: {
      messageID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Message in the DB
export function create(req, res) {
  Message.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Message in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Message.find({
    where: {
      messageID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

function syncMails(customerMail){
   console.log('\n\n Sync Mail \n\n');
   console.log('\n\n _______________ \n\n');
  //imap.secureserver.net
  var config =  {
    "username": "lagodio@alvsoftwarellc.com",
    "password": "Baiser12!",
    "imap": {
      "host": "imap.secureserver.net",
      "port": 993,
      "secure": true
    }
  };

  var server = new imap({
    user: config.username,
    password: config.password,
    host: config.imap.host,
    port: config.imap.port,
    tls:config.imap.secure,
    debug: console.log
  });

  var openInbox = function(cb) {
    server.openBox('INBOX', true, cb);
  }

  var timestamp = null;

  var exitOnErr = function(err) {
    console.error(err);
    server.end();
  }

  var init = function(t){
    timestamp = t;
    server.connect(timestamp);
  }

  var emails = {};
  var processMail = function (mail, msgID){
    console.log('\n\n\n');
    console.log(mail);
    console.log('\n\n\n ___________ \n\n');
    var m = {
      from: mail['from'],
      replyTo: mail['replyTo'],
      subject: mail['subject'],
      to: mail['to'],
      date: mail['date'],
      receivedDate: mail['receivedDate'],
      content: {
        plain: mail['text'],
        html: mail['html']
      }
    }
    emails[mail.messageId] = m;
  }

  server.once('ready', function() {
    openInbox(function(err, box) {
      if (err) throw err;
      timestamp = null;
      var today = moment().startOf('day').format('MMM DD[,] YYYY');
      var searchOptions = [['OR', ['FROM', customerMail], ['TO', customerMail]], ["SINCE", today]];
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
            disconnect();
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
    archiveEmails();
  });

  var disconnect = function(){
    server.end();
  }

  var archiveEmails = function(){
    console.log(inspect(emails, false, null));
  }

  init();
}




// Deletes a Message from the DB
export function destroy(req, res) {
  Message.find({
    where: {
      messageID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
