/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/socialMedias              ->  index
 * POST    /api/socialMedias              ->  create
 * GET     /api/socialMedias/:id          ->  show
 * PUT     /api/socialMedias/:id          ->  update
 * DELETE  /api/socialMedias/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';

var Twit = require('twit');
var config = require('../../socialConfig');

// instantiate Twit module
var twitter = new Twit(config.twitter);
var TWITTER_SEARCH_URL = 'search/tweets';

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


//search twitter for username, keywords & filter by location
export function searchTwitter(req, res){
  console.log('***** Twitter Search Called ******');
  console.log('\n*** Params ***\n');
  console.log(req.params);
  console.log("\n**************\n")
  console.log('\n*** Query ***\n');
  console.log(req.query);
  console.log('\n*****************\n');
  if (!req.query) return res.status(404).end();
  var params = req.query;
  // request data
  twitter.get(TWITTER_SEARCH_URL, params)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}














//
//
// // Gets a list of SocialMedias
// export function index(req, res) {
//   SocialMedia.findAll()
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }
//
// // Gets a single SocialMedia from the DB
// export function show(req, res) {
//   SocialMedia.find({
//     where: {
//       _id: req.params.id
//     }
//   })
//     .then(handleEntityNotFound(res))
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }
//
// // Creates a new SocialMedia in the DB
// export function create(req, res) {
//   SocialMedia.create(req.body)
//     .then(respondWithResult(res, 201))
//     .catch(handleError(res));
// }
//
// // Updates an existing SocialMedia in the DB
// export function update(req, res) {
//   if (req.body._id) {
//     delete req.body._id;
//   }
//   SocialMedia.find({
//     where: {
//       _id: req.params.id
//     }
//   })
//     .then(handleEntityNotFound(res))
//     .then(saveUpdates(req.body))
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }
//
// // Deletes a SocialMedia from the DB
// export function destroy(req, res) {
//   SocialMedia.find({
//     where: {
//       _id: req.params.id
//     }
//   })
//     .then(handleEntityNotFound(res))
//     .then(removeEntity(res))
//     .catch(handleError(res));
// }
