/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/customers              ->  index
 * POST    /api/customers              ->  create
 * GET     /api/customers/:id          ->  show
 * PUT     /api/customers/:id          ->  update
 * DELETE  /api/customers/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Customer} from '../../sqldb';
import config from '../../config/environment';


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
    res.status(statusCode).send(err);
  };
}

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    res.status(statusCode).json(err);
  }
}

// Gets a list of Customers
export function index(req, res) {
   if (!req.user) return validationError(res, 400);
   var customers = (req.query.hasOwnProperty('name') && req.query.name) ?
        Customer.findAndCountAll({
          where: Customer.sequelize.where(Customer.sequelize.fn('concat', Customer.sequelize.col('firstName'), ' ', Customer.sequelize.col('lastName')), {
            like: '%'+ req.query.name + '%'
          }),
          limit: config.pagination,
          order: [['customerID', 'DESC']]
        }): Customer.findAndCountAll({
            limit: config.pagination,
            order: [['customerID', 'DESC']]
        });
   return customers.then(respondWithResult(res)).catch(handleError(res));
}


// Gets a single Customer from the DB
export function show(req, res) {
  Customer.find({
    where: {
      customerID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Customer in the DB
export function create(req, res) {
  Customer.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}


// Updates an existing Customer in the DB
export function update(req, res) {
  if (req.body.customerID) {
    delete req.body.customerID;
  }
  Customer.find({
    where: {
      customerID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Customer from the DB
export function destroy(req, res) {
  Customer.find({
    where: {
      customerID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
