'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var dealCtrlStub = {
  index: 'dealCtrl.index',
  show: 'dealCtrl.show',
  create: 'dealCtrl.create',
  update: 'dealCtrl.update',
  destroy: 'dealCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var dealIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './deal.controller': dealCtrlStub
});

describe('Deal API Router:', function() {

  it('should return an express router instance', function() {
    dealIndex.should.equal(routerStub);
  });

  describe('GET /api/deals', function() {

    it('should route to deal.controller.index', function() {
      routerStub.get
        .withArgs('/', 'dealCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/deals/:id', function() {

    it('should route to deal.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'dealCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/deals', function() {

    it('should route to deal.controller.create', function() {
      routerStub.post
        .withArgs('/', 'dealCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/deals/:id', function() {

    it('should route to deal.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'dealCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/deals/:id', function() {

    it('should route to deal.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'dealCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/deals/:id', function() {

    it('should route to deal.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'dealCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
