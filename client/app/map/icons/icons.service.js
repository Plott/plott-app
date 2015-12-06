(function() {
  'use strict';

    angular
      .module('plottAppApp')
      .factory('icons', icons);

    icons.$inject = [];

    function icons() {
      var service = {
        sensor: setSensor
      };
      return service;

      /**
       * @name setSensor
       * @desc Creates sensor icon for leaflet map
       * @param {String} status Name of the sensor status, matches icons found in assets
       */
      function setSensor(status) {
        var url;

        if (status) {
          url = 'assets/images/rssi_' + status + '.png'
        }

        var sensor = L.icon({
          iconUrl: url || 'assets/images/rssi_active.gif',
          iconSize: [35, 35], // size of the icon
          // iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
          // popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        return sensor;
      }

    }

})();
