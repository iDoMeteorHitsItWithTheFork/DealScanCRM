'use strict';

var express = require('express');
var controller = require('./gmail.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();
var passport = require('passport')
var util = require('util')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var Gmail = require('node-gmail-api');
var OAuth = require('oauthio');

var access_token;

passport.use(new GoogleStrategy({
      clientID: '524026123631-ta8tefv0gjb6s8kvjqiotjf8gh180ljh.apps.googleusercontent.com',
      clientSecret: 'hqfnHdwgIWAfADaB4eAa78Xn',
      callbackURL: "http://localhost:9000/api/gmail/emails"
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
    }));

//router.get('/', passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/gmail.readonly'] }));

router.get('/emails', function(req, res) {
  var data = [];
  console.log(access_token);
  var gmail = new Gmail(access_token);
  var s = gmail.messages('label:inbox', {format: 'raw', max: 100})
  s.on('data', function (d) {
    console.log("starting stream...");

    data.push(d);
  })
  s.on('end', function (d) {
    console.log('stream ended...');
    //console.log(d.snippet);

    console.log(data);
    res.send(data).end();
  })


});


module.exports = router;
