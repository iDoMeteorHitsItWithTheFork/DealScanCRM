/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/watchlists              ->  index
 * POST    /api/watchlists              ->  create
 * GET     /api/watchlists/:id          ->  show
 * PUT     /api/watchlists/:id          ->  update
 * DELETE  /api/watchlists/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Watchlist} from '../../sqldb';
import {Dealership} from '../../sqldb';
import {User} from '../../sqldb';
import {Keyword} from '../../sqldb';
import {Source} from '../../sqldb';


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
    console.log(err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Watchlists
export function index(req, res) {
  var watchlists = (req.query.hasOwnProperty('dealershipName') && req.query.dealershipName.trim() != '') ?
    (Watchlist.findAll({
      include: [
        {
          model: Dealership,
          where: {
            dealershipName: req.query.dealershipName
          }
        },
        {
          model: User,
          as: 'ListOwner',
          attributes: ['firstName', 'lastName', 'email', 'userID', 'phone'],
          required: true
        },
        {
          model: Keyword,
          required: true
        },
        {
          model: Source,
          as: 'MonitoringSources',
          required: true
        }
      ],
    })) : (Watchlist.findAll({
    include: [
      {model: Dealership, required: true},
      {
        model: User,
        as: 'ListOwner',
        attributes: ['firstName', 'lastName', 'email', 'userID', 'phone'],
        required: true
      },
      {model: Keyword, required: true}
    ]
  }));
  return watchlists.then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Watchlist from the DB
export function show(req, res) {
  Watchlist.find({
    where: {
      watchlistID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Watchlist in the DB
export function create(req, res) {
  if (!req.user) return res, status(500).send('User is required!');
  if (!req.body.Watchlist) return res.status(500).send('Watchlist Details are required!');
  if (!req.body.Sources) return res.status(500).send('Monitoring Sources are required!');
  if (!req.body.Keywords) return res.status(500).send('Monitoring Keyword are required!');

  var watchlist = req.body.Watchlist;
  var sources = req.body.Sources;
  var keywords = req.body.Keywords;

  if (!watchlist.WatchlistName || watchlist.WatchlistName.trim() == '') res.status(500).send('WatchlistName cannot be empty');
  if (!watchlist.dealershipName || watchlist.dealershipName.trim() == '') res.status(500).send('Dealership Name is required')

  /* Set Watchlist Object */
  var new_watchlist = {};
  new_watchlist.WatchlistName = watchlist.WatchlistName;
  new_watchlist.dealershipName = watchlist.dealershipName;
  if (watchlist.WatchlistInfo) new_watchlist.WatchlistInfo = watchlist.WatchlistInfo;

  /* Validating the presences of Social Sources and Keywords */
  if (!Array.isArray(sources) || (Array.isArray(sources) && sources.length == 0))
    res.status(500).send('Source must be an array and cannot be empty');
  if (!Array.isArray(keywords) || (Array.isArray(keywords) && keywords.length == 0))
    res.status(500).send('Keyword must be an array and cannot be empty');

  /* Validating Sources */
  for (var i = 0; i < sources.length; i++) {
    if (sources[i] != 'facebook' && sources[i] != 'twitter' && sources[i] != 'instagram') {
      res.status(500).send('Invalid Social Sources').end();
      break;
    }
  }

  return Watchlist.sequelize.transaction(function (t) {
    // chain all your queries here. make sure you return them.
    return Watchlist.create({
        watchlistName: new_watchlist.WatchlistName,
        watchlistInfo: new_watchlist.WatchlistInfo,
        Keywords: keywords
      }, {include: [Keyword]},
      {transaction: t})
      .then(function (watchlist) {
        return Source.findAll({
          where: {
            source: sources
          },
          transaction: t
        }).then(function (sources) {
          return watchlist.setMonitoringSources(sources, {status: 'off'}, {transaction: t})
            .then(function (results) {
              return Dealership.find({
                where: {
                  dealershipName: new_watchlist.dealershipName
                },
                transaction: t
              }).then(function (dealership) {
                if (dealership) {
                  return watchlist.setDealership(dealership, {transaction: t})
                    .then(function (results) {
                      return User.find({
                        where: {
                          userID: req.user.userID
                        },
                        transaction: t
                      }).then(function (user) {
                        if (user) {
                          return watchlist.setListOwner(user, {transaction: t}).then(function () {
                            //updateStream(keywords);
                            return watchlist;
                          });
                        } else return res.status(500).send('Error[]: Unable to authenticate you request');
                      });
                    });
                } else return res.status(500).send('Error[]: Unable to find dealership ' + new_watchlist.dealershipName);
              });
            });
        });

      }).then(function (watchlist) {
        return watchlist ? res.status(201).json(watchlist)
          : res.status(500).send('Error[]: Unable to create Watchlist to Monitor');
      }).catch(handleError(res));
  })
}

// Updates an existing Watchlist in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Watchlist.find({
    where: {
      watchlistID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Watchlist from the DB
export function destroy(req, res) {
  Watchlist.find({
    where: {
      watchlistID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
