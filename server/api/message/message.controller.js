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
  searchOptions.recipient = req.query.sender;
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
                return message;
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
