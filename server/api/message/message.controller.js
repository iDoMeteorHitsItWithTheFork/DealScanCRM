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
import {User} from '../../sqldb';
import {Customer} from '../../sqldb';
import {Lead} from '../../sqldb';





var imap = require("imap");
var mailparser = require("mailparser").MailParser;
var inspect = require('util').inspect;

var fs = require("fs");
var moment = require('moment');
var Q = require('q');



function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    console.log(err);
    throw err;
    res.status(statusCode).send(err);
  };
}

// Gets a list of Messages
export function index(req, res) {
  if (!req.query.recipientID) return res.status(500).send('RecipientID is required!');
  if (!req.query.recipient) return res.status(500).send('Recipient is required!');
  var searchOptions = {};
  searchOptions.recipientID = req.query.recipientID;
  searchOptions.recipient = req.query.recipient;
  if (req.query.type && req.query.type.toString().trim() != '') searchOptions.type = req.query.type;
  return Message.findAll({
    where: searchOptions,
    order: [['messageID', 'DESC']]
  })
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

  if (!req.body) return res.status(500).send('Message Details are missing');
  if (!req.body.id || req.body.id.toString().trim() == '' ) return res.status(500).send('RecipientID is required!');
  if (!req.body.recipient || req.body.recipient.toString().trim() == '' ) return res.status(500).send('Recipient is required!');
  if (!req.body.message || req.body.message.toString().trim() == '') return res.status(500).send('Message is required');

  var userID = req.user.userID;
  var recipientID = req.body.id;
  var recipientType = req.body.recipient;
  var message = req.body.message;

  return Message.sequelize.transaction(function(t){

    return User.find({
      where: {
       userID: userID
      },
      attributes: ['userID', 'firstName', 'lastName', 'email', 'phone', 'role'],
      transaction: t
    }).then(function(user){

      var recipient = null;
      if (recipientType == 'customer') {
        recipient = Customer.find({
          where: {
            customerID: recipientID
          },
          transaction: t
        });

      } else if (recipientType == 'lead') {
        recipient = Lead.find({
          where: {
            leadID: recipientID
          },
          transaction: t
        })
      }

      return recipient.then(function(recipient){

        var config = require('./twilio.config.json');
        var smsClient = require('twilio')(config.sid, config.token);

        if (recipient.phone && recipient.phone.toString().trim() !=''){
          //sanatize phone number [remove dashes, space, etc]
          return smsClient.sendMessage({
            messagingServiceSid: config.serviceId,
            to: '+1'+recipient.phone,
            body: message
          }).then(function(result){
            if (result){
              return recipient.createMessage({
                message_uuid: result.sid,
                from: user.profile.email,
                name: user.profile.name,
                to: '+1' + recipient.phone,
                subject: null,
                priority: 'normal',
                date: result.date_created,
                body: message,
                type: 'text',
                status: 'sent'
              }, {transaction: t}).then(function (message) {
                if (recipientType == 'lead'){
                  return recipient.update({
                    status: 'working'
                  }, {transaction: t}).then(function(){
                    return message;
                  })
                } else return message;
              })
            } else return res.status(500).send('Unable to send text message');
          }).fail(function(err){
             console.log(err);
             return err;
          })
        } else return res.status(500).send('No Phone number available for customer');
      })

    })

  }).then(function(message){
     return res.status(200).json(message);
  }).catch(handleError(res));

}

export function receiveMessage(req, res){
  return res.status(200).json({success: true, message: 'Message received!'});
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


export function reloadInbox(req, res){
    console.log('\n\n RELOAD INBOX \n\n');
    console.log(req.query);
    console.log('\n\n +++++++++++++++ \n\n');
    if (!req.query.recipientID || req.query.recipientID.toString().trim() == '') res.status(500).send('RecipientID is required!');
    if (!req.query.recipient || req.query.recipient.toString().trim() == '') res.status(500).send('Recipient is required!');
    return Customer.find({
      where: {
        customerID: req.query.recipientID
      }
    }).then(function(customer){
      if (customer.profile.email && customer.profile.email.toString().trim() != ''){
        var email = customer.profile.email;
        var lastSync = customer.profile.lastEmailSync;
        var now = moment();
        var mails;
        if (lastSync && lastSync.toString().trim() != '' ){
          lastSync = moment(lastSync);
          mails = syncMails(customer, lastSync, now);
        } else mails = syncMails(customer, moment().startOf('day'), now);
        return mails.then(function(){
          return Message.findAll({
            where: {
              recipientID: req.query.recipientID,
              recipient: req.query.recipient
            },
            order: [['messageID', 'DESC']]
          })
            .then(respondWithResult(res))
            .catch(handleError(res));
        })
      } else res.status(500).send('There is no emails on file for this customer. Please update customer emails');
    })
}



function syncMails(customer, timestamp, now) {

  var df = Q.defer();

  console.log('\n\n ----------------\n\n');
  console.log('\n\n Sync Mail \n\n');
  console.log('\n\n ----------------\n\n');

  //imap.secureserver.net
  var config = {
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
    tls: config.imap.secure,
    debug: console.log
  });

  var openInbox = function (cb) {
    server.openBox('INBOX', true, cb);
  }
  var timestamp = timestamp;
  var exitOnErr = function (err) {
    console.error(err);
    server.end();
    archiveEmails();
  }

  var init = function () {
    server.connect();
  }

  var emails = {};
  var processMail = function (mail, msgID) {
    var m = {
      messageId: mail['messageId'],
      from: mail['from'][0].address,
      name: mail['from'][0].name,
      to: mail['to'],
      subject: mail['subject'],
      priority: mail['priority'],
      date: mail['date'],
      content: {
        plain: mail['text'],
        html: mail['html']
      }
    }
    emails[mail.messageId] = m;
  }

  server.once('ready', function () {
    openInbox(function (err, box) {
      if (err) throw err;
      //timestamp = null;
      var searchOptions = timestamp ?
        [['OR', ['FROM', customer.profile.email], ['TO', customer.profile.email]], ["SINCE", moment(timestamp).format('MMM DD[,] YYYY')]] :
        [['OR', ['FROM', customer.profile.email], ['TO', customer.profile.email]], ["SINCE", moment().startOf('day').format('MMM DD[,] YYYY')]];
      server.search(searchOptions, function (err, results) {
        if (err) {
          console.log('\n>> EXITING ON INBOX SEARCH ERROR...\n\n');
          exitOnErr(err);
        }
        if (results && results.length > 0) {

          var fetch = server.fetch(results, {
            bodies: ''
          });

          fetch.on('message', function (msg, seqno) {

            var parser = new mailparser();


            msg.on('body', function (stream, info) {
              stream.pipe(parser);
            });

            parser.on("end", function (mail_object) {
              processMail(mail_object, seqno);
            });

            msg.once('end', function () {
              parser.end();
            });

          });

          fetch.on('end', function () {
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

  server.once('error', function (err) {
    console.log('\n>> EXITING ON SERVER IMAP SERVER ERROR...\n\n');
    exitOnErr(err);
  });

  server.once('end', function () {
    console.log('Connection ended');
    archiveEmails();
  });

  var disconnect = function () {
    server.end();
  }

  var archiveEmails = function () {
    var keys = Object.keys(emails);
    var mails = [];
    for (var k in emails) if (emails.hasOwnProperty(k)) mails.push(emails[k]);
    console.log(inspect(mails, false, null));
    return Customer.sequelize.transaction(function (t) {
      var promises = [];
      for (var i = 0; i < mails.length; i++) promises.push(Message.syncMail(mails[i], customer, t));
      return Q.all(promises).then(function (syncedMails) {
        if (syncedMails){
          return customer.update({
            lastEmailSync: now
          }, {transaction: t}).then(function () {
            return customer
          })
        } else return customer;
      })
    }).then(function () {
      return df.resolve(customer);
    })
      .catch(function (err) {
        console.log(err);
        return df.reject(err);
      })
  }

  init();

  return df.promise;
}
