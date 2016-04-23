/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/notes              ->  index
 * POST    /api/notes              ->  create
 * GET     /api/notes/:id          ->  show
 * PUT     /api/notes/:id          ->  update
 * DELETE  /api/notes/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Note} from '../../sqldb';
import {User} from '../../sqldb';
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

// Gets a list of Notes
export function index(req, res) {
  Note.findAndCountAll({
    include: [{
      model: User,
      as: 'Creator',
      attributes: ['userID', 'email', 'firstName', 'lastName', 'phone', 'role']
    }],
    where: {
      customerID: req.query.customerID
    }
  }, {logging: console.log}).then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Note from the DB
export function show(req, res) {
  Note.find({
    where: {
      noteID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Note in the DB
export function create(req, res) {
  Note.create(req.body)
    .then(function(note){
        return Note.find({
          include: [{
            model: User,
            as: 'Creator',
            attributes: ['userID', 'email', 'firstName', 'lastName', 'phone', 'role']
          }],
          where: {
            noteID: note.noteID
          }
        })
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Note in the DB
export function update(req, res) {
  if (req.body.noteID) {
    delete req.body.noteID;
  }
  Note.find({
    where: {
      noteID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(function(note){
      return Note.find({
        include: [{
          model: User,
          as: 'Creator',
          attributes: ['userID', 'email', 'firstName', 'lastName', 'phone', 'role']
        }],
        where: {
          noteID: note.noteID
        }
      })
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Note from the DB
export function destroy(req, res) {
  Note.find({
    where: {
      noteID: req.params.id,
      creatorID: req.user.userID
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
