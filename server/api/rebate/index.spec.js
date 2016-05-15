'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var rebateCtrlStub = {
  index: 'rebateCtrl.index',
  show: 'rebateCtrl.show',
  create: 'rebateCtrl.create',
  update: 'rebateCtrl.update',
  destroy: 'rebateCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var rebateIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './rebate.controller': rebateCtrlStub
});

describe('Rebate API Router:', function() {

  it('should return an express router instance', function() {
    rebateIndex.should.equal(routerStub);
  });

  describe('GET /api/rebates', function() {

    it('should route to rebate.controller.index', function() {
      routerStub.get
        .withArgs('/', 'rebateCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/rebates/:id', function() {

    it('should route to rebate.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'rebateCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/rebates', function() {

    it('should route to rebate.controller.create', function() {
      routerStub.post
        .withArgs('/', 'rebateCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/rebates/:id', function() {

    it('should route to rebate.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'rebateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/rebates/:id', function() {

    it('should route to rebate.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'rebateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/rebates/:id', function() {

    it('should route to rebate.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'rebateCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
