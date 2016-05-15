'use strict';

var app = require('../..');
import request from 'supertest';

var newRebate;

describe('Rebate API:', function() {

  describe('GET /api/rebates', function() {
    var rebates;

    beforeEach(function(done) {
      request(app)
        .get('/api/rebates')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          rebates = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      rebates.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/rebates', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/rebates')
        .send({
          name: 'New Rebate',
          info: 'This is the brand new rebate!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newRebate = res.body;
          done();
        });
    });

    it('should respond with the newly created rebate', function() {
      newRebate.name.should.equal('New Rebate');
      newRebate.info.should.equal('This is the brand new rebate!!!');
    });

  });

  describe('GET /api/rebates/:id', function() {
    var rebate;

    beforeEach(function(done) {
      request(app)
        .get('/api/rebates/' + newRebate._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          rebate = res.body;
          done();
        });
    });

    afterEach(function() {
      rebate = {};
    });

    it('should respond with the requested rebate', function() {
      rebate.name.should.equal('New Rebate');
      rebate.info.should.equal('This is the brand new rebate!!!');
    });

  });

  describe('PUT /api/rebates/:id', function() {
    var updatedRebate;

    beforeEach(function(done) {
      request(app)
        .put('/api/rebates/' + newRebate._id)
        .send({
          name: 'Updated Rebate',
          info: 'This is the updated rebate!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedRebate = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRebate = {};
    });

    it('should respond with the updated rebate', function() {
      updatedRebate.name.should.equal('Updated Rebate');
      updatedRebate.info.should.equal('This is the updated rebate!!!');
    });

  });

  describe('DELETE /api/rebates/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/rebates/' + newRebate._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when rebate does not exist', function(done) {
      request(app)
        .delete('/api/rebates/' + newRebate._id)
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
