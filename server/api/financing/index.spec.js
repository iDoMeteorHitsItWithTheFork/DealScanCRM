'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var financingCtrlStub = {
  index: 'financingCtrl.index',
  show: 'financingCtrl.show',
  create: 'financingCtrl.create',
  update: 'financingCtrl.update',
  destroy: 'financingCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var financingIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './financing.controller': financingCtrlStub
});

describe('Financing API Router:', function() {

  it('should return an express router instance', function() {
    financingIndex.should.equal(routerStub);
  });

  describe('GET /api/financings', function() {

    it('should route to financing.controller.index', function() {
      routerStub.get
        .withArgs('/', 'financingCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/financings/:id', function() {

    it('should route to financing.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'financingCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/financings', function() {

    it('should route to financing.controller.create', function() {
      routerStub.post
        .withArgs('/', 'financingCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/financings/:id', function() {

    it('should route to financing.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'financingCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/financings/:id', function() {

    it('should route to financing.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'financingCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/financings/:id', function() {

    it('should route to financing.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'financingCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
