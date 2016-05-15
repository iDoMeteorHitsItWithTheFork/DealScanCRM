'use strict';

var app = require('../..');
import request from 'supertest';

var newDeal;

describe('Deal API:', function() {

  describe('GET /api/deals', function() {
    var deals;

    beforeEach(function(done) {
      request(app)
        .get('/api/deals')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          deals = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      deals.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/deals', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/deals')
        .send({
          name: 'New Deal',
          info: 'This is the brand new deal!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDeal = res.body;
          done();
        });
    });

    it('should respond with the newly created deal', function() {
      newDeal.name.should.equal('New Deal');
      newDeal.info.should.equal('This is the brand new deal!!!');
    });

  });

  describe('GET /api/deals/:id', function() {
    var deal;

    beforeEach(function(done) {
      request(app)
        .get('/api/deals/' + newDeal._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          deal = res.body;
          done();
        });
    });

    afterEach(function() {
      deal = {};
    });

    it('should respond with the requested deal', function() {
      deal.name.should.equal('New Deal');
      deal.info.should.equal('This is the brand new deal!!!');
    });

  });

  describe('PUT /api/deals/:id', function() {
    var updatedDeal;

    beforeEach(function(done) {
      request(app)
        .put('/api/deals/' + newDeal._id)
        .send({
          name: 'Updated Deal',
          info: 'This is the updated deal!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDeal = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDeal = {};
    });

    it('should respond with the updated deal', function() {
      updatedDeal.name.should.equal('Updated Deal');
      updatedDeal.info.should.equal('This is the updated deal!!!');
    });

  });

  describe('DELETE /api/deals/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/deals/' + newDeal._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when deal does not exist', function(done) {
      request(app)
        .delete('/api/deals/' + newDeal._id)
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
