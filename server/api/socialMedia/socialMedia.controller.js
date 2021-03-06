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
import {User} from  '../../sqldb';
import {Dealership} from '../../sqldb';
import {Watchlist} from '../../sqldb';
import {Source} from '../../sqldb';
import {Keyword} from '../../sqldb';

var Twit = require('twit');
var config = require('./socialStream/socialConfig');
var Promise = require('bluebird');
var Q = require('q');


// instantiate Twit module
var twitter = new Twit(config.twitter);
var TWITTER_SEARCH_URL = 'search/tweets';
var TWITTER_LIKE_URL = 'favorites/create';
var TWITTER_RETWEET_URL = 'statuses/retweet/:id';
var TWITTER_TWEET_URL= 'statuses/update';


//instantiate Facebook module
var facebook = require('fbgraph');
Promise.promisifyAll(facebook);
facebook.setVersion('2.6');
var isFbTokenSet = false;


/**
 * Update Stream with keywords
 * @param keywords
 */
function updateStreamManager(keywords){




}


/**
 *
 * Utilities functions
 */
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

/**
 *
 * Functional Methods
 */


//search twitter for username, keywords & filter by location
export function searchTwitter(req, res){
  if (!req.query) return res.status(500).send('Error[]: Query Parameters are required!');
  var params = req.query;
  twitter.get(TWITTER_SEARCH_URL, params)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// like a tweet
export function favTweet(req, res){
  if (!req.body.postID) return res.status(500).send('Error[]: PostID is required!');
  twitter.post(TWITTER_LIKE_URL, { id: req.body.postID })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//retweet
export function tweet(req, res){
  if (!req.body.message) return res.status(500).send('Error[]:Tweet body is required');
  twitter.post(TWITTER_TWEET_URL, {status: req.body.message })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//retweet
export function reTweet(req, res){
   if (!req.body.postID) return res.status(500).send('Error[]: PostID is required');
   twitter.post(TWITTER_RETWEET_URL, {id: req.body.postID })
     .then(handleEntityNotFound(res))
     .then(respondWithResult(res))
     .catch(handleError(res));
}

//Set Facebook Access Token
export function setFbToken(req, res){
  if (!req.body.accessToken)
    return res.status(500).send('Error[]: Access Token is required!');
  var token = req.body.accessToken;
  facebook.setAccessToken(token); //set access token
  isFbTokenSet = true;
  facebook.getAsync('/me?fields=name,email,picture')
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//search facebook for name, posts, place, page
export function searchFacebook(req, res){

  var q = req.query.q;
  var location  = req.query.geocode;
  if (!q && !location) res.status(500).send('Error[]: Query Parameters are required!');

  if (!isFbTokenSet) {
    var token = res.cookie('fbToken') ? res.cookie('fbToken'): null;
    if (!token) res.status(500).send('Error[]: No Available Access Token. Please check facebook login status.');
    facebook.setAccessToken(token);
    isFbTokenSet = true;
  }

  var searchOptions = {
    q: q,
    type: 'page',
    limit: 25,
  };

  /*if (location){
    searchOptions.center = [req.query.geocode.lat, req.query.geocode.lon];
    searchOptions.distance = req.query.geocode.distance;
  }*/

  var feed ='/feed?';
  //if (location && location.enforce) feed +='with=location&';
  feed += 'fields=from{name, picture},message,created_time,coordinates,' +
    'attachments,comments.limit(3).summary(true){attachment,like_count,from{name, picture},' +
    'created_time,message},likes.limit(3).summary(true),actions';

  facebook.searchAsync(searchOptions)
    .then(handleEntityNotFound(res))
    .then(function(results){
        if (results.data && results.data.length > 0){
          var ps = [];
          for(var i=0; i < results.data.length; i++)
            ps.push(facebook.getAsync(results.data[i].id+feed));
          return Q.all(ps).then(function(posts){
             var _res = {data:[], paging:[]};
             // console.log(posts);
             for(var i=0; i < posts.length; i++){
               _res.data = _res.data.concat(posts[i].data);
               _res.paging.push(posts[i].paging);
             }
             res.json(_res);
          }).catch(function(err){ return err;});
        } else res.json(results);
    })
    .catch(handleError(res));



}
