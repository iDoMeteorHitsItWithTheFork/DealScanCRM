'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var bdcCtrlStub = {
  index: 'bdcCtrl.index',
  show: 'bdcCtrl.show',
  create: 'bdcCtrl.create',
  update: 'bdcCtrl.update',
  destroy: 'bdcCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var bdcIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './bdc.controller': bdcCtrlStub
});

describe('Bdc API Router:', function() {

  it('should return an express router instance', function() {
    bdcIndex.should.equal(routerStub);
  });

  describe('GET /api/bdc', function() {

    it('should route to bdc.controller.index', function() {
      routerStub.get
        .withArgs('/', 'bdcCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/bdc/:id', function() {

    it('should route to bdc.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'bdcCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/bdc', function() {

    it('should route to bdc.controller.create', function() {
      routerStub.post
        .withArgs('/', 'bdcCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/bdc/:id', function() {

    it('should route to bdc.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'bdcCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/bdc/:id', function() {

    it('should route to bdc.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'bdcCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/bdc/:id', function() {

    it('should route to bdc.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'bdcCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
