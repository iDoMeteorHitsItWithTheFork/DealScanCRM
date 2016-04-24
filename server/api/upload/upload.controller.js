/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/uploads              ->  index
 * POST    /api/uploads              ->  create
 * GET     /api/uploads/:id          ->  show
 * PUT     /api/uploads/:id          ->  update
 * DELETE  /api/uploads/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Upload} from '../../sqldb';

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

// Gets a list of Uploads
export function index(req, res) {
  Upload.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Upload from the DB
export function show(req, res) {
  Upload.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Upload in the DB
export function create(req, res) {
  if (!req.files) return res.status(500).send('No files uploaded');
  res.status(200).send('File uploaded!')
  //Upload.create(req.body)
  //  .then(respondWithResult(res, 201))
  //  .catch(handleError(res));



}

// Updates an existing Upload in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Upload.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Upload from the DB
export function destroy(req, res) {
  Upload.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
