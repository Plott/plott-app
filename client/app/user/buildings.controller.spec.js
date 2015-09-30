'use strict';

describe('Controller: BuildingsCtrl', function () {

  // load the controller's module
  beforeEach(module('plottAppApp'));

  var BuildingsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuildingsCtrl = $controller('BuildingsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
