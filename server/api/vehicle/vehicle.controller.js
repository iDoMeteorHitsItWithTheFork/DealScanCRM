/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/vehicles              ->  index
 * POST    /api/vehicles              ->  create
 * GET     /api/vehicles/:id          ->  show
 * PUT     /api/vehicles/:id          ->  update
 * DELETE  /api/vehicles/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Vehicle} from '../../sqldb';

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

// Gets a list of Vehicles
export function index(req, res) {
  Vehicle.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Vehicle from the DB
export function show(req, res) {
  Vehicle.find({
    where: {
      vehicleID: req.params.id,
      VIN: req.params.VIN
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Vehicle in the DB
export function create(req, res) {
  Vehicle.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Vehicle in the DB
export function update(req, res) {
  if (req.body.vehicleID) {
    delete req.body.vehicleID;
  }
  Vehicle.find({
    where: {
      vehicleID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Vehicle from the DB
export function destroy(req, res) {
  Vehicle.find({
    where: {
      vehicleID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
