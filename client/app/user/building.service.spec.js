'use strict';

describe('Service: building', function () {

  // load the service's module
  beforeEach(module('plottAppApp'));

  // instantiate service
  var building;
  beforeEach(inject(function (_building_) {
    building = _building_;
  }));

  it('should do something', function () {
    expect(!!building).toBe(true);
  });

});
