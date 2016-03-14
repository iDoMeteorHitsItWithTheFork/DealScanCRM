'use strict';

var app = require('../..');
import request from 'supertest';

var newDealership;

describe('Dealership API:', function() {

  describe('GET /api/dealerships', function() {
    var dealerships;

    beforeEach(function(done) {
      request(app)
        .get('/api/dealerships')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          dealerships = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      dealerships.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/dealerships', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/dealerships')
        .send({
          name: 'New Dealership',
          info: 'This is the brand new dealership!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDealership = res.body;
          done();
        });
    });

    it('should respond with the newly created dealership', function() {
      newDealership.name.should.equal('New Dealership');
      newDealership.info.should.equal('This is the brand new dealership!!!');
    });

  });

  describe('GET /api/dealerships/:id', function() {
    var dealership;

    beforeEach(function(done) {
      request(app)
        .get('/api/dealerships/' + newDealership._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          dealership = res.body;
          done();
        });
    });

    afterEach(function() {
      dealership = {};
    });

    it('should respond with the requested dealership', function() {
      dealership.name.should.equal('New Dealership');
      dealership.info.should.equal('This is the brand new dealership!!!');
    });

  });

  describe('PUT /api/dealerships/:id', function() {
    var updatedDealership;

    beforeEach(function(done) {
      request(app)
        .put('/api/dealerships/' + newDealership._id)
        .send({
          name: 'Updated Dealership',
          info: 'This is the updated dealership!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDealership = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDealership = {};
    });

    it('should respond with the updated dealership', function() {
      updatedDealership.name.should.equal('Updated Dealership');
      updatedDealership.info.should.equal('This is the updated dealership!!!');
    });

  });

  describe('DELETE /api/dealerships/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/dealerships/' + newDealership._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when dealership does not exist', function(done) {
      request(app)
        .delete('/api/dealerships/' + newDealership._id)
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
