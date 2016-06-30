'use strict';

var app = require('../..');
import request from 'supertest';

var newSocialMedia;

describe('SocialMedia API:', function() {

  describe('GET /api/socialMedias', function() {
    var socialMedias;

    beforeEach(function(done) {
      request(app)
        .get('/api/socialMedias')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          socialMedias = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      socialMedias.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/socialMedias', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/socialMedias')
        .send({
          name: 'New SocialMedia',
          info: 'This is the brand new socialMedia!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newSocialMedia = res.body;
          done();
        });
    });

    it('should respond with the newly created socialMedia', function() {
      newSocialMedia.name.should.equal('New SocialMedia');
      newSocialMedia.info.should.equal('This is the brand new socialMedia!!!');
    });

  });

  describe('GET /api/socialMedias/:id', function() {
    var socialMedia;

    beforeEach(function(done) {
      request(app)
        .get('/api/socialMedias/' + newSocialMedia._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          socialMedia = res.body;
          done();
        });
    });

    afterEach(function() {
      socialMedia = {};
    });

    it('should respond with the requested socialMedia', function() {
      socialMedia.name.should.equal('New SocialMedia');
      socialMedia.info.should.equal('This is the brand new socialMedia!!!');
    });

  });

  describe('PUT /api/socialMedias/:id', function() {
    var updatedSocialMedia;

    beforeEach(function(done) {
      request(app)
        .put('/api/socialMedias/' + newSocialMedia._id)
        .send({
          name: 'Updated SocialMedia',
          info: 'This is the updated socialMedia!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedSocialMedia = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSocialMedia = {};
    });

    it('should respond with the updated socialMedia', function() {
      updatedSocialMedia.name.should.equal('Updated SocialMedia');
      updatedSocialMedia.info.should.equal('This is the updated socialMedia!!!');
    });

  });

  describe('DELETE /api/socialMedias/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/socialMedias/' + newSocialMedia._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when socialMedia does not exist', function(done) {
      request(app)
        .delete('/api/socialMedias/' + newSocialMedia._id)
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
