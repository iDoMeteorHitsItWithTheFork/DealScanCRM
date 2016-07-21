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

// Gets a list of Leads
export function index(req, res) {
  Lead.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
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
  Lead.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
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
      dealID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
