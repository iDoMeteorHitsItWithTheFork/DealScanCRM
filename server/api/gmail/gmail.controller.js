'use strict';

import _ from 'lodash';
import {User} from  '../../sqldb';
import {Dealership} from '../../sqldb';
import {Watchlist} from '../../sqldb';
import {Source} from '../../sqldb';
import {Keyword} from '../../sqldb';

var Gmail = require('node-gmail-api');
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var gmailNode = require('gmail-node');

export function login () {

  var clientSecret = {
    installed: {
      client_id: "524026123631-ta8tefv0gjb6s8kvjqiotjf8gh180ljh.apps.googleusercontent.com",
      project_id: "rosy-cache-137017",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://accounts.google.com/o/oauth2/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_secret: "hqfnHdwgIWAfADaB4eAa78Xn",
      redirect_uris: [
        "urn:ietf:wg:oauth:2.0:oob",
        "http://localhost:9000"
      ]
    }
  };
  gmailNode.init(clientSecret, './token.json', function(err,data){
    console.log(err);
    console.log(data);
  });
}

