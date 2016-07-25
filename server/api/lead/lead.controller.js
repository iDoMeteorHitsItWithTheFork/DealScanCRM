/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/leads              ->  index
 * POST    /api/leads              ->  create
 * GET     /api/leads/:id          ->  show
 * PUT     /api/leads/:id          ->  update
 * DELETE  /api/leads/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Lead} from '../../sqldb';
import {User} from '../../sqldb';
import {Dealership} from '../../sqldb';
import {Event} from '../../sqldb';

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

// Gets a list of Leads
export function index(req, res) {
  if (!req.user) return res.status(500).send('Unable to authenticate request');
  return User.find({
    where:{
      userID: req.user.userID
    },
    include: [
      {
        model: Dealership,
        as: 'Employer',
        required: true
      }
    ]
  }).then(function(user){
      return Lead.findAll({
        where: {
          dealershipID: user.Employer[0].token.dealerID
        }
      }).then(respondWithResult(res))
    }).catch(handleError(res));
}

// Gets a single Lead from the DB
export function show(req, res) {
  Lead.find({
    where: {
      leadID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Lead in the DB
export function create(req, res) {
   if (!req.body) return res.status(500).send('Lead Details are required!');
   if (!req.user) return res.status(500).send('Unable to authenticate request');
   if (!req.body.name) return res.status(500).send('Lead Name is required');
   if (!req.body.phone) return res.status(500).send('Lead Phone is required');
   if (!req.body.source) return res.status(500).send('Lead Source is required');

  var details = {};
  details.name = req.body.name;
  details.phone = req.body.phone;
  details.email = req.body.email;
  details.address = req.body.address;
  details.interest = req.body.interest;
  details.additionalInfo = req.body.additionalInfo;
  details.sourceName = req.body.source.name;
  details.sourceType = req.body.source.type;

  var appointment;
  if (req.body.hasOwnProperty('appointment') && req.body.appointment && req.body.appointment.Date && req.body.appointment.Time)
    appointment = req.body.appointment;

  return User.find({
    where:{
      userID: req.user.userID
    },
    include: [
      {
        model: Dealership,
        as: 'Employer',
        required: true
      }
    ]
  }).then(function(user){
    return Lead.findOrCreate({
      where: {
        name: details.name,
        phone: details.phone
      },
      defaults:details
    })
      .spread(function(lead, created){
        console.log("Created: "+created);
        return (created) ?
          lead.setCreator(user).then(function(result){
             return lead.setDealership(user.Employer[0])
               .then(function(){
                  return res.status(200).json(lead);
             })
          }) : res.status(200).json({error: {msg: 'Sorry, this lead already exist', code:''}});
      })
  }).catch(handleError(res));
}


export function scheduleAppointment(req, res) {
  if (!req.user) return res.status(500).send('Unable to Authenticate your request');
  if (!req.body) return res.status(500).send('Appointment Details are required');
  if (!req.body.leadID) return res.status(500).send('leadID is required');
  if (!req.body.appointment) return res.status(500).send('Appointment is required');
  return Event.sequelize.transaction(function (t) {
    return User.find({
      where: {
        userID: req.user.userID
      },
      include: [
        {
          model: Dealership,
          as: 'Employer',
          required: true
        }
      ],
      transaction: t
    }).then(function (user) {
      var user = user;
      return Lead.find({
        where: {
          leadID: req.body.leadID
        },
        transaction: t
      }).then(function (lead) {
        var details = {
          name: lead.name,
          description: req.description,
          location: user.Employer[0].dealerInfo.address,
          time: req.body.appointment,
          category: 'appointment',
          status: 'open'
        };
        return Event.create(details, {transaction: t})
          .then(function (event) {
            return event.addLead(lead, {transaction: t, logging: console.log})
              .then(function () {
                console.log('>> Lead added to event');
                return event;
              });
          })
      })

    }).then(function (event) {
      return res.status(200).json(event);
    }).catch(handleError(res));
  });
}
// Updates an existing Lead in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Lead.find({
    where: {
      leadID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Lead from the DB
export function destroy(req, res) {
  Lead.find({
    where: {
      leadID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
