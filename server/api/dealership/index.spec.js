'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var dealershipCtrlStub = {
  index: 'dealershipCtrl.index',
  show: 'dealershipCtrl.show',
  create: 'dealershipCtrl.create',
  update: 'dealershipCtrl.update',
  destroy: 'dealershipCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var dealershipIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './dealership.controller': dealershipCtrlStub
});

describe('Dealership API Router:', function() {

  it('should return an express router instance', function() {
    dealershipIndex.should.equal(routerStub);
  });

  describe('GET /api/dealerships', function() {

    it('should route to dealership.controller.index', function() {
      routerStub.get
        .withArgs('/', 'dealershipCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/dealerships/:id', function() {

    it('should route to dealership.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'dealershipCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/dealerships', function() {

    it('should route to dealership.controller.create', function() {
      routerStub.post
        .withArgs('/', 'dealershipCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/dealerships/:id', function() {

    it('should route to dealership.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'dealershipCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/dealerships/:id', function() {

    it('should route to dealership.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'dealershipCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/dealerships/:id', function() {

    it('should route to dealership.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'dealershipCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
