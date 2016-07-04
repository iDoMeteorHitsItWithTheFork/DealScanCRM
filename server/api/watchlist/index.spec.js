'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var watchlistCtrlStub = {
  index: 'watchlistCtrl.index',
  show: 'watchlistCtrl.show',
  create: 'watchlistCtrl.create',
  update: 'watchlistCtrl.update',
  destroy: 'watchlistCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var watchlistIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './watchlist.controller': watchlistCtrlStub
});

describe('Watchlist API Router:', function() {

  it('should return an express router instance', function() {
    watchlistIndex.should.equal(routerStub);
  });

  describe('GET /api/watchlists', function() {

    it('should route to watchlist.controller.index', function() {
      routerStub.get
        .withArgs('/', 'watchlistCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/watchlists/:id', function() {

    it('should route to watchlist.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'watchlistCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/watchlists', function() {

    it('should route to watchlist.controller.create', function() {
      routerStub.post
        .withArgs('/', 'watchlistCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/watchlists/:id', function() {

    it('should route to watchlist.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'watchlistCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/watchlists/:id', function() {

    it('should route to watchlist.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'watchlistCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/watchlists/:id', function() {

    it('should route to watchlist.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'watchlistCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
