/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/deals              ->  index
 * POST    /api/deals              ->  create
 * GET     /api/deals/:id          ->  show
 * PUT     /api/deals/:id          ->  update
 * DELETE  /api/deals/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Deal} from '../../sqldb';
import {User} from '../../sqldb';
import {Customer} from '../../sqldb';
import {Vehicle} from '../../sqldb';
import {Trade} from '../../sqldb';

var Q = require('q');


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
    res.status(statusCode).send(err);
  };
}

// Gets a list of Deals
export function index(req, res) {

  Deal.findAll({
      include:[
        {
          model: User,
          as:'SaleRep',
          attributes: ['firstName', 'lastName', 'role'],
          required: true
        },
        {
          model: Customer,
          as: 'Buyer',
          attributes: ['firstName', 'lastName', 'phone', 'email', 'source'],
          required: true
        },
        {
          model: Customer,
          as: 'CoBuyers',
          attributesL: ['firstName', 'lastName', 'phone', 'email', 'source']
        },
        {
          model: Vehicle,
          as: 'Purchase',
          attributes: ['make', 'model', 'year', 'trimLevel', 'state', 'classification'],
          required: true
        },
      ]
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Deal from the DB
export function show(req, res) {
  Deal.find({
    where: {
      dealID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Deal in the DB
export function create(req, res) {
  Deal.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Sync Deals  in the DB
export function sync(req, res) {

  console.log(' -- Deals To Process ---');
  //console.log(req.body);
  var deals = req.body;
  var promises = [];
  for(var i=0; i < deals.length; i++)
    promises.push(Deal.dscUpsert(deals[i]));
  return Q.all(promises).then(respondWithResult(res)).catch(handleError(res));
}

function parseDeal(data){

  var deal = {};


  return deal;
}

// Updates an existing Deal in the DB
export function update(req, res) {
  if (req.body.dealID) {
    delete req.body.dealID;
  }
  Deal.find({
    where: {
      dealID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Deal from the DB
export function destroy(req, res) {
  Deal.find({
    where: {
      dealID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
