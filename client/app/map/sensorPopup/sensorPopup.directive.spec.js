'use strict';

describe('Directive: sensorPopup', function () {

  // load the directive's module and view
  beforeEach(module('plottAppApp'));
  beforeEach(module('app/map/sensorPopup/sensorPopup.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sensor-popup></sensor-popup>');
    element = $compile(element)(scope);
    scope.$apply();
  }));
});
