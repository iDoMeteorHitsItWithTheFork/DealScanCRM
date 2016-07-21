'use strict';

import {User} from '../../sqldb';
import {Dealership} from '../../sqldb';
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
    console.log(err);
    throw err;
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
export function getFilters(req, res) {
  return User.find({
    where: {
      userID:  req.user.userID
    },
    attributes: ['firstName', 'lastName', 'email', 'userID', 'role'],
    include: [
      {
        model: Dealership,
        as: 'Employer',
        attributes: ['dealershipName', 'dealershipID', 'streetAddress', 'city', 'state', 'zipCode'],
        include: [
          {
            model: User,
            as: 'Owners',
            attributes: ['firstName', 'lastName', 'email', 'userID', 'role']
          },
          {
            model: User,
            as: 'GeneralManagers',
            attributes: ['firstName', 'lastName', 'email', 'userID', 'role']
          },
          {
            model: Team,
            attributes: ['teamID', 'teamName'],
            include: [
              {
                model: User,
                as: 'TeamMembers',
                attributes: ['firstName', 'lastName', 'email', 'userID', 'role'],
                where: {
                  userID: {
                    $ne: req.user.userID
                  },
                  role: {
                    $or:['sale_rep','sale_mgr','nw_car_sale_mgr','usd_car_sale_mgr']
                  }
                },
                order: [['role', 'DESC']]
              },
              {
                model: User,
                as: 'TeamManagers',
                attributes: ['firstName', 'lastName', 'email', 'userID', 'role']
              }
            ]
          }
        ]
      }
    ]
  }).then(function (filters) {
      //console.log(filters);
      if (filters.Employer){
        var _filters = [];
        for (var i = 0; i < filters.Employer.length; i++){
          var dealer = filters.Employer[i];
          var dealership = {
            DealershipID: dealer.dealershipID,
            DealershipName: dealer.dealershipName,
            DealershipAddress: dealer.streetAddress+', '+dealer.city+', '+dealer.state+' '+dealer.zipCode,
            Owners: dealer.Owners,
            GeneralManagers: dealer.GeneralManagers,
            Teams: dealer.Teams
          };
          var owners = [];
          for (var j=0; j < dealership.Owners.length; j++){
             var owner = dealership.Owners[j];
             owners.push({
               OwnerID: owner.userID,
               profile: owner.profile
             })
          }
          dealership.Owners = owners;
          var gms = [];
          for (var k=0; k < dealership.GeneralManagers.length; k++){
            var gm = dealership.GeneralManagers[k];
            gms.push({
              GeneralManagerID: gm.userID,
              profile: gm.profile
            })
          }
          dealership.GeneralManagers = gms;
          var teams = [];
          for(var x = 0; x < dealership.Teams.length; x++){
            var team = dealership.Teams[x];
            var t = {};
            t.TeamID = team.teamID;
            t.TeamName = team.teamName;
            t.TeamManagers = [];
            for(var y = 0; y < team.TeamManagers.length; y++){
              t.TeamManagers.push({
                ManagerID: team.TeamManagers[y].userID,
                profile: team.TeamManagers[y].profile
              })
            }
            t.TeamMembers = [];
            for(var w = 0; w < team.TeamMembers.length; w++){
              t.TeamMembers.push({
                MemberID: team.TeamMembers[w].userID,
                profile: team.TeamMembers[w].profile
              })
            }
            teams.push(t);
          }
          dealership.Teams = teams;
          _filters.push(dealership);
        }
      }
      return res.status(200).json(_filters);
  }).catch(handleError(res));

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
