'use strict';

describe('Directive: mapInfo', function () {

  // load the directive's module and view
  beforeEach(module('plottAppApp'));
  beforeEach(module('app/map/map-info/map-info.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<map-info></map-info>');
    element = $compile(element)(scope);
    scope.$apply();
  }));
});
