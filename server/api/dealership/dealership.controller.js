/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/dealerships              ->  index
 * POST    /api/dealerships              ->  create
 * GET     /api/dealerships/:id          ->  show
 * PUT     /api/dealerships/:id          ->  update
 * DELETE  /api/dealerships/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Dealership} from '../../sqldb';

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

// Gets a list of Dealerships
export function index(req, res) {
  Dealership.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Dealership from the DB
export function show(req, res) {
  Dealership.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Dealership in the DB
export function create(req, res) {
  Dealership.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Dealership in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Dealership.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Dealership from the DB
export function destroy(req, res) {
  Dealership.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
