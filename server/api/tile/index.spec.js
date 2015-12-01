'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var tileCtrlStub = {
  index: 'tileCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var tileIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './tile.controller': tileCtrlStub
});

describe('Tile API Router:', function() {

  it('should return an express router instance', function() {
    tileIndex.should.equal(routerStub);
  });

  describe('GET /api/tiles', function() {

    it('should route to tile.controller.index', function() {
      routerStub.get
        .withArgs('/', 'tileCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
