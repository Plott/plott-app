(function() {
  'use strict';

  angular
    .module('plottAppApp')
    .factory('sensorService', sensorService);

  sensorService.$inject = ['$log', '$http', '$q'];

  function sensorService($log, $http, $q) {
    var service = {
      byFloor: byFloor
    };

    return service;

    /**
     * [byFloor description]
     * @return {Promise} [Response containing geojson feature service]
     */
    function byFloor(building, floor) {
      var config = {
        params: {
          building: building,
          floor: floor
        }
      };
      return $http.get('/api/sensors/building/', config);
    }


  }


})();
