'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var sensorCtrlStub = {
  index: 'sensorCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var sensorIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './sensor.controller': sensorCtrlStub
});

describe('Sensor API Router:', function() {

  it('should return an express router instance', function() {
    sensorIndex.should.equal(routerStub);
  });

  describe('GET /api/sensors', function() {

    it('should route to sensor.controller.index', function() {
      routerStub.get
        .withArgs('/', 'sensorCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
