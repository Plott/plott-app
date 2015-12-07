(function() {
  'use strict';

  angular
    .module('plottAppApp')
    .directive('mapInfo', mapInfo);

  mapInfo.$inject = ['$log'];

  function mapInfo($log) {
    let directive = {
      templateUrl: 'app/map/map-info/map-info.html',
      restrict: 'E',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        floor: '=',
        wifi: '='
      },
      bindToController: true
    };

    return directive;

    function controller() {
      let vm = this;
      vm.floor = vm.floor || 1;
      vm.wifi = vm.wifi || [];

    }
  }

})();
