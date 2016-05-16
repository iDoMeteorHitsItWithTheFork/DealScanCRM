/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/financings              ->  index
 * POST    /api/financings              ->  create
 * GET     /api/financings/:id          ->  show
 * PUT     /api/financings/:id          ->  update
 * DELETE  /api/financings/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Financing} from '../../sqldb';

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

// Gets a list of Financings
export function index(req, res) {
  Financing.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Financing from the DB
export function show(req, res) {
  Financing.find({
    where: {
      financingID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Financing in the DB
export function create(req, res) {
  Financing.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Financing in the DB
export function update(req, res) {
  if (req.body.financingID) {
    delete req.body.financingID;
  }
  Financing.find({
    where: {
      financingID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Financing from the DB
export function destroy(req, res) {
  Financing.find({
    where: {
      financingID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
