'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var leadCtrlStub = {
  index: 'leadCtrl.index',
  show: 'leadCtrl.show',
  create: 'leadCtrl.create',
  update: 'leadCtrl.update',
  destroy: 'leadCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var leadIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './lead.controller': leadCtrlStub
});

describe('Lead API Router:', function() {

  it('should return an express router instance', function() {
    leadIndex.should.equal(routerStub);
  });

  describe('GET /api/leads', function() {

    it('should route to lead.controller.index', function() {
      routerStub.get
        .withArgs('/', 'leadCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/leads/:id', function() {

    it('should route to lead.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'leadCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/leads', function() {

    it('should route to lead.controller.create', function() {
      routerStub.post
        .withArgs('/', 'leadCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/leads/:id', function() {

    it('should route to lead.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'leadCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/leads/:id', function() {

    it('should route to lead.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'leadCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/leads/:id', function() {

    it('should route to lead.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'leadCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
