'use strict';

var app = require('../..');
import request from 'supertest';

var newLead;

describe('Lead API:', function() {

  describe('GET /api/leads', function() {
    var leads;

    beforeEach(function(done) {
      request(app)
        .get('/api/leads')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          leads = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      leads.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/leads', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/leads')
        .send({
          name: 'New Lead',
          info: 'This is the brand new lead!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newLead = res.body;
          done();
        });
    });

    it('should respond with the newly created lead', function() {
      newLead.name.should.equal('New Lead');
      newLead.info.should.equal('This is the brand new lead!!!');
    });

  });

  describe('GET /api/leads/:id', function() {
    var lead;

    beforeEach(function(done) {
      request(app)
        .get('/api/leads/' + newLead._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          lead = res.body;
          done();
        });
    });

    afterEach(function() {
      lead = {};
    });

    it('should respond with the requested lead', function() {
      lead.name.should.equal('New Lead');
      lead.info.should.equal('This is the brand new lead!!!');
    });

  });

  describe('PUT /api/leads/:id', function() {
    var updatedLead;

    beforeEach(function(done) {
      request(app)
        .put('/api/leads/' + newLead._id)
        .send({
          name: 'Updated Lead',
          info: 'This is the updated lead!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedLead = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLead = {};
    });

    it('should respond with the updated lead', function() {
      updatedLead.name.should.equal('Updated Lead');
      updatedLead.info.should.equal('This is the updated lead!!!');
    });

  });

  describe('DELETE /api/leads/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/leads/' + newLead._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when lead does not exist', function(done) {
      request(app)
        .delete('/api/leads/' + newLead._id)
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
