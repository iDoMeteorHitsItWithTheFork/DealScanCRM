'use strict';

var app = require('../..');
import request from 'supertest';

var newWatchlist;

describe('Watchlist API:', function() {

  describe('GET /api/watchlists', function() {
    var watchlists;

    beforeEach(function(done) {
      request(app)
        .get('/api/watchlists')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          watchlists = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      watchlists.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/watchlists', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/watchlists')
        .send({
          name: 'New Watchlist',
          info: 'This is the brand new watchlist!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newWatchlist = res.body;
          done();
        });
    });

    it('should respond with the newly created watchlist', function() {
      newWatchlist.name.should.equal('New Watchlist');
      newWatchlist.info.should.equal('This is the brand new watchlist!!!');
    });

  });

  describe('GET /api/watchlists/:id', function() {
    var watchlist;

    beforeEach(function(done) {
      request(app)
        .get('/api/watchlists/' + newWatchlist._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          watchlist = res.body;
          done();
        });
    });

    afterEach(function() {
      watchlist = {};
    });

    it('should respond with the requested watchlist', function() {
      watchlist.name.should.equal('New Watchlist');
      watchlist.info.should.equal('This is the brand new watchlist!!!');
    });

  });

  describe('PUT /api/watchlists/:id', function() {
    var updatedWatchlist;

    beforeEach(function(done) {
      request(app)
        .put('/api/watchlists/' + newWatchlist._id)
        .send({
          name: 'Updated Watchlist',
          info: 'This is the updated watchlist!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedWatchlist = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedWatchlist = {};
    });

    it('should respond with the updated watchlist', function() {
      updatedWatchlist.name.should.equal('Updated Watchlist');
      updatedWatchlist.info.should.equal('This is the updated watchlist!!!');
    });

  });

  describe('DELETE /api/watchlists/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/watchlists/' + newWatchlist._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when watchlist does not exist', function(done) {
      request(app)
        .delete('/api/watchlists/' + newWatchlist._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
