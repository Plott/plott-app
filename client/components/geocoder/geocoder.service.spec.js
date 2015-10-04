'use strict';

describe('Service: geocoder', function () {

  // load the service's module
  beforeEach(module('plottAppApp'));

  // instantiate service
  var geocoder;
  beforeEach(inject(function (_geocoder_) {
    geocoder = _geocoder_;
  }));

  it('should do something', function () {
    expect(!!geocoder).toBe(true);
  });

});
