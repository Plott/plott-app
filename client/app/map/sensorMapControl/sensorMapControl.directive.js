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
      $log.debug('Controller Active', vm.active);
    }

    function link(scope, elem, attr, vm) {
        scope.$watch('vm.active', function(){
          if (vm.active){
            // $log.debug(elem.context.style.backgroundImage)
            angular.elemet(elem).css({'background-image': 'url("/assets/images/rssi_on.png")'})
            // elem.context.style.backgroundImage = 'url("/assets/images/rssi_on.png")';
            // elem.css({'background-image': 'url("/assets/images/rssi_on.png")'});
          }
        })
    }
  }
})();
