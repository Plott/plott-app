(function() {
  'use strict';

  angular
    .module('plottAppApp')
    .directive('sensorPopup', sensorPopup);

  sensorPopup.$inject = ['$log', '$http'];

  function sensorPopup($log, $http) {
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
      vm.updateSensor = updateSensor;

      function updateSensor(formData) {
        vm.data.properties = formData;

        $http.put('/api/sensors/' + vm.data._id, vm.data)
          .then(function(res) {
            $log.debug('Sensor PUT:', res.status, res.data);
          })
          .catch(function(err) {
            $log.error(err);
          });
      }

      vm.deleteSensor = deleteSensor;

      function deleteSensor() {
        $http.delete('/api/sensors/' + vm.data._id)
          .then(function(res) {
            $log.debug('Sensor DELETE:', res.status, res);
          })
          .catch(function(err) {
            $log.error('Sensor DELETE:', res.status, err);
          });
      }


    }

    function link(scope, elem, attrs, vm) {
      scope.$watch('vm.data', function(){
        if(vm.data){
          angular.extend(vm.formData, vm.data.properties);
        }
      });
    }

  }
})();
