'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var socialMediaCtrlStub = {
  index: 'socialMediaCtrl.index',
  show: 'socialMediaCtrl.show',
  create: 'socialMediaCtrl.create',
  update: 'socialMediaCtrl.update',
  destroy: 'socialMediaCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var socialMediaIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './socialMedia.controller': socialMediaCtrlStub
});

describe('SocialMedia API Router:', function() {

  it('should return an express router instance', function() {
    socialMediaIndex.should.equal(routerStub);
  });

  describe('GET /api/socialMedias', function() {

    it('should route to socialMedia.controller.index', function() {
      routerStub.get
        .withArgs('/', 'socialMediaCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/socialMedias/:id', function() {

    it('should route to socialMedia.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'socialMediaCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/socialMedias', function() {

    it('should route to socialMedia.controller.create', function() {
      routerStub.post
        .withArgs('/', 'socialMediaCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/socialMedias/:id', function() {

    it('should route to socialMedia.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'socialMediaCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/socialMedias/:id', function() {

    it('should route to socialMedia.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'socialMediaCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/socialMedias/:id', function() {

    it('should route to socialMedia.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'socialMediaCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
