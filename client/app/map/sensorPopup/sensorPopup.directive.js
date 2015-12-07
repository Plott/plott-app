(function() {
  'use strict';

  angular
    .module('plottAppApp')
    .directive('sensorPopup', sensorPopup);

  sensorPopup.$inject = ['$log'];

  function sensorPopup($log) {
    var directive = {
      templateUrl: 'app/map/sensorPopup/sensorPopup.html',
      restrict: 'E',
      link: link,
      controller: controller,
      controllerAs: 'vm',
      bindToController: true,
      transclude: true,
      scope: {
        data: '='
      }
    };

    return directive;

    function controller() {
      var vm = this;
      vm.activeOptions = [false, true];
      vm.formData = {
        active: false
      };
    }

    function link(scope, elem, attrs, vm) {
      scope.$watch('vm.data', function(){
        $log.debug('Sensor Popup Link', vm.data);
        if(vm.data){
          angular.extend(vm.formData, vm.data.properties);
          $log.debug('FormData', vm.formData)
        }
      })
    }
  }
})();
