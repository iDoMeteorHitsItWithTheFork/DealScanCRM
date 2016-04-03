/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/teams              ->  index
 * POST    /api/teams              ->  create
 * GET     /api/teams/:id          ->  show
 * PUT     /api/teams/:id          ->  update
 * DELETE  /api/teams/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Dealership} from '../../sqldb';
import {Team} from '../../sqldb';
import {User} from '../../sqldb';
import config from '../../config/environment';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    console.log('responding with results');
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    console.log('saving updates');
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

// Gets a list of Teams
export function index(req, res) {
  Team.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Team from the DB
export function show(req, res) {
  Team.find({
    where: {
      teamID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Team in the DB
export function create(req, res) {
  Team.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Team in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Team.find({
    where: {
      teamID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// get a list of teams a user belongs to
export function getUserTeams(req, res) {
  if (!req.user) {
    res.status(404).end();
    return null;
  }
  return User.find({
    where: {
      userID: req.user.userID
    }
  }).then(handleEntityNotFound(res))
    .then(function (user) {
      user.getMyTeams({
        include: [{
          model: User,
          as: 'TeamMembers',
          attributes: ['userID', 'email', 'firstName', 'lastName', 'role']
        }]
      })
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
    });
}

// get a list of the user managers
export function getManagers(req, res) {
  if (!req.user) {
    res.status(404).end();
    return null;
  }
  return User.find({
    where: {
      userID: req.user.userID
    }
  }).then(handleEntityNotFound(res))
    .then(function (user) {
      user.getOrganizations({
        include: [{
          model: User,
          attributes: ['userID', 'email', 'firstName', 'lastName', 'role'],
          as: 'Employees',
          where: {
            role: {
              $between: [config.userRoles.indexOf('sale_mgr'), config.userRoles.indexOf('admin')]
            }
          }
        }]
      })
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
    });
}


// Deletes a Team from the DB
export function destroy(req, res) {
  Team.find({
    where: {
      teamID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
