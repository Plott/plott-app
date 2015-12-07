'use strict';

describe('Directive: sensorMapControl', function () {

  // load the directive's module and view
  beforeEach(module('plottAppApp'));
  beforeEach(module('app/map/sensorMapControl/sensorMapControl.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sensor-map-control></sensor-map-control>');
    element = $compile(element)(scope);
    scope.$apply();
  }));
});
