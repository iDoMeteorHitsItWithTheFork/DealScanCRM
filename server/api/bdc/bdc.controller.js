/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/bdc              ->  index
 * POST    /api/bdc              ->  create
 * GET     /api/bdc/:id          ->  show
 * PUT     /api/bdc/:id          ->  update
 * DELETE  /api/bdc/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Bdc} from '../../sqldb';
import mock from './bdc.mock';

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



// Gets a list of Bdcs
export function index(req, res) {
  res.send({
    metrics: mock.metrics,
    dealerships: mock.dealerships,
    summary_stats: mock.summary_stats,
    stats: mock.stats
  })
}

// Gets a single Bdc from the DB
export function show(req, res) {
  return Bdc.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Bdc in the DB
export function create(req, res) {
  return Bdc.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Bdc in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Bdc.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Bdc from the DB
export function destroy(req, res) {
  return Bdc.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
