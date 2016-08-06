import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as ClientPasswordStrategy} from 'passport-oauth2-client-password';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {Client} from '../../sqldb';

function localAuthenticate(User, email, password, done) {
  User.find({
    where: {
      email: email.toLowerCase()
    }
  })
    .then(user => {
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      user.authenticate(password, function(authError, authenticated) {
        if (authError) {
          return done(authError);
        }
        if (!authenticated) {
          return done(null, false, { message: 'This password is not correct.' });
        } else {
          return done(null, user);
        }
      });
    })
    .catch(err => done(err));
}

export function setup(User, config) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, function(email, password, done) {
    return localAuthenticate(User, email, password, done);
  }));
}

export function AuthenticateClient(Client, config) {
  passport.use(new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
      Client.find({
        where: {
          clientId: clientId
        }
      }).then(function (client) {
        if (!client) return done(null, false);
        if (client.clientSecret != clientSecret) return done(null, false);
        return done(null, client);
      }).catch(function (err) {
        return done(err);
      })
    }
  ));
}

export function validateAccessToken(AccessToken, config) {
  passport.use(new
    BearerStrategy(
    function (accessToken, done) {
      AccessToken.find({
        where: {
          token: accessToken
        },
        include: [{
          model: Client,
          required: true
        }]
      }).then(function (token) {
        if (!token) return done(null, false);
        if (!token.client) return done(null, false, {message: 'Unknown client'});
        return done(null, token);
      }).catch(function (err) {
        return done(err);
      })
    }
  ));
}

