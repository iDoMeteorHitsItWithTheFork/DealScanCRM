'use strict';

var app = require('../..');
import request from 'supertest';

var newTrade;

describe('Trade API:', function() {

  describe('GET /api/trades', function() {
    var trades;

    beforeEach(function(done) {
      request(app)
        .get('/api/trades')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          trades = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      trades.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/trades', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/trades')
        .send({
          name: 'New Trade',
          info: 'This is the brand new trade!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newTrade = res.body;
          done();
        });
    });

    it('should respond with the newly created trade', function() {
      newTrade.name.should.equal('New Trade');
      newTrade.info.should.equal('This is the brand new trade!!!');
    });

  });

  describe('GET /api/trades/:id', function() {
    var trade;

    beforeEach(function(done) {
      request(app)
        .get('/api/trades/' + newTrade._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          trade = res.body;
          done();
        });
    });

    afterEach(function() {
      trade = {};
    });

    it('should respond with the requested trade', function() {
      trade.name.should.equal('New Trade');
      trade.info.should.equal('This is the brand new trade!!!');
    });

  });

  describe('PUT /api/trades/:id', function() {
    var updatedTrade;

    beforeEach(function(done) {
      request(app)
        .put('/api/trades/' + newTrade._id)
        .send({
          name: 'Updated Trade',
          info: 'This is the updated trade!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTrade = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTrade = {};
    });

    it('should respond with the updated trade', function() {
      updatedTrade.name.should.equal('Updated Trade');
      updatedTrade.info.should.equal('This is the updated trade!!!');
    });

  });

  describe('DELETE /api/trades/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/trades/' + newTrade._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when trade does not exist', function(done) {
      request(app)
        .delete('/api/trades/' + newTrade._id)
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
