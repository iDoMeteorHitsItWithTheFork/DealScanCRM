'use strict';

var app = require('../..');
import request from 'supertest';

var newBdc;

describe('Bdc API:', function() {

  describe('GET /api/bdc', function() {
    var bdcs;

    beforeEach(function(done) {
      request(app)
        .get('/api/bdc')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          bdcs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      bdcs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/bdc', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/bdc')
        .send({
          name: 'New Bdc',
          info: 'This is the brand new bdc!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBdc = res.body;
          done();
        });
    });

    it('should respond with the newly created bdc', function() {
      newBdc.name.should.equal('New Bdc');
      newBdc.info.should.equal('This is the brand new bdc!!!');
    });

  });

  describe('GET /api/bdc/:id', function() {
    var bdc;

    beforeEach(function(done) {
      request(app)
        .get('/api/bdc/' + newBdc._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          bdc = res.body;
          done();
        });
    });

    afterEach(function() {
      bdc = {};
    });

    it('should respond with the requested bdc', function() {
      bdc.name.should.equal('New Bdc');
      bdc.info.should.equal('This is the brand new bdc!!!');
    });

  });

  describe('PUT /api/bdc/:id', function() {
    var updatedBdc;

    beforeEach(function(done) {
      request(app)
        .put('/api/bdc/' + newBdc._id)
        .send({
          name: 'Updated Bdc',
          info: 'This is the updated bdc!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBdc = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBdc = {};
    });

    it('should respond with the updated bdc', function() {
      updatedBdc.name.should.equal('Updated Bdc');
      updatedBdc.info.should.equal('This is the updated bdc!!!');
    });

  });

  describe('DELETE /api/bdc/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/bdc/' + newBdc._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when bdc does not exist', function(done) {
      request(app)
        .delete('/api/bdc/' + newBdc._id)
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
