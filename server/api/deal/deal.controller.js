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
  Deal.findAll()
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
