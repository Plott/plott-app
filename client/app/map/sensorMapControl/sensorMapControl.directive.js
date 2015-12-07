(function () {
  'use strict';

  angular
    .module('plottAppApp')
    .directive('sensorMapControl', sensorMapControl);

  sensorMapControl.$inject = ['$log'];

  function sensorMapControl($log) {
    var directive = {
      templateUrl: 'app/map/sensorMapControl/sensorMapControl.html',
      restrict: 'E',
      scope: {
        active: '='
      },
      controller: controller,
      controllerAs: 'vm',
      transclude: true,
      bindToController: true,
      link: link
      // link:
    };

    return directive;

    function controller() {
      var vm = this;
    }

    function link(scope, elem, attr, vm) {}
  }
})();
