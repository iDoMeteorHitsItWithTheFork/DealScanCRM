'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var tradeCtrlStub = {
  index: 'tradeCtrl.index',
  show: 'tradeCtrl.show',
  create: 'tradeCtrl.create',
  update: 'tradeCtrl.update',
  destroy: 'tradeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var tradeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './trade.controller': tradeCtrlStub
});

describe('Trade API Router:', function() {

  it('should return an express router instance', function() {
    tradeIndex.should.equal(routerStub);
  });

  describe('GET /api/trades', function() {

    it('should route to trade.controller.index', function() {
      routerStub.get
        .withArgs('/', 'tradeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/trades/:id', function() {

    it('should route to trade.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'tradeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/trades', function() {

    it('should route to trade.controller.create', function() {
      routerStub.post
        .withArgs('/', 'tradeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/trades/:id', function() {

    it('should route to trade.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'tradeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/trades/:id', function() {

    it('should route to trade.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'tradeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/trades/:id', function() {

    it('should route to trade.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'tradeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
