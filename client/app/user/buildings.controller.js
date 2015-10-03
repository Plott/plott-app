(function(){
  'use strict';

  angular
    .module('plottAppApp')
    .controller('BuildingsCtrl', BuildingsCtrl);

    BuildingsCtrl.$inject = ['$http', 'socket', 'MAPBOX', 'Upload'];

  function BuildingsCtrl($http, socket, MAPBOX, Upload) {
    var self = this;
    self.building = {};
    L.mapbox.accessToken = MAPBOX.TOKEN;
      var map = L.mapbox.map('building-map', 'mapbox.streets')
        .setView([36.84, -95.71], 4)
        .addControl(L.mapbox.geocoderControl('mapbox.places', {
        autocomplete: true
      }));
  }

})();
