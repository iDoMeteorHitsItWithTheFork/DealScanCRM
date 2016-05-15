'use strict';

import {User} from '../../sqldb';
import {Team} from '../../sqldb';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  User.findAll({
    attributes: [
      'userID',
      'firstName',
      'lastName',
      'email',
      'phone',
      'role',
      'provider'
    ]
  })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('role', 'user');
  newUser.save()
    .then(function (user) {
      var token = jwt.sign({userID: user.userID}, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({token});
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  User.find({
    where: {
      userID: userId
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Get a single user teamates
 */
export function getTeamMates(req, res, next) {
  return User.findAll({
    where: {
      userID: {
        $ne: req.user.userID
      },
      role: {
        $lt:config.userRoles.indexOf(req.user.role)
      }
    }
  }).then(function (teammates) {
    if (!teammates) return res.status(404).end();
    return res.status(200).json(teammates);
  }).catch(function (err) {
    next(err);
  });

}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  User.destroy({userID: req.params.id})
    .then(function () {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user.userID;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.find({
    where: {
      userID: userId
    }
  })
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user.userID;

  User.find({
    where: {
      userID: userId
    },
    attributes: [
      'userID',
      'firstName',
      'lastName',
      'email',
      'phone',
      'role',
      'provider'
    ]
  })
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Get a single user metrics
 */
export function getMetrics(req, res, next) {
  // return User.findAll({
  //   where: {
  //     userID: {
  //       $ne: req.user.userID
  //     },
  //     role: {
  //       $lt:config.userRoles.indexOf(req.user.role)
  //     }
  //   }
  // }).then(function (teammates) {
  //   if (!teammates) return res.status(404).end();
  //   return res.status(200).json(teammates);
  // }).catch(function (err) {
  //   next(err);
  // });

}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}
