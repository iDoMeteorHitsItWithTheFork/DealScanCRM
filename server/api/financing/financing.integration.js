'use strict';

var app = require('../..');
import request from 'supertest';

var newFinancing;

describe('Financing API:', function() {

  describe('GET /api/financings', function() {
    var financings;

    beforeEach(function(done) {
      request(app)
        .get('/api/financings')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          financings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      financings.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/financings', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/financings')
        .send({
          name: 'New Financing',
          info: 'This is the brand new financing!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newFinancing = res.body;
          done();
        });
    });

    it('should respond with the newly created financing', function() {
      newFinancing.name.should.equal('New Financing');
      newFinancing.info.should.equal('This is the brand new financing!!!');
    });

  });

  describe('GET /api/financings/:id', function() {
    var financing;

    beforeEach(function(done) {
      request(app)
        .get('/api/financings/' + newFinancing._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          financing = res.body;
          done();
        });
    });

    afterEach(function() {
      financing = {};
    });

    it('should respond with the requested financing', function() {
      financing.name.should.equal('New Financing');
      financing.info.should.equal('This is the brand new financing!!!');
    });

  });

  describe('PUT /api/financings/:id', function() {
    var updatedFinancing;

    beforeEach(function(done) {
      request(app)
        .put('/api/financings/' + newFinancing._id)
        .send({
          name: 'Updated Financing',
          info: 'This is the updated financing!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedFinancing = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFinancing = {};
    });

    it('should respond with the updated financing', function() {
      updatedFinancing.name.should.equal('Updated Financing');
      updatedFinancing.info.should.equal('This is the updated financing!!!');
    });

  });

  describe('DELETE /api/financings/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/financings/' + newFinancing._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when financing does not exist', function(done) {
      request(app)
        .delete('/api/financings/' + newFinancing._id)
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
