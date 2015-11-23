(function(){
  'use strict';

  angular
    .module('plottAppApp')
    .controller('MapCtrl', MapCtrl);

  MapCtrl.$inject = ['$scope', '$log', '$http', 'socket', 'MAPBOX'];

  function MapCtrl($scope, $log, $http, socket, MAPBOX) {
    var vm = this;
    vm.floor = 2;
    vm.coverageFeatures = [];
    vm.deleteCoverage = deleteCoverage;
    L.mapbox.accessToken = MAPBOX.TOKEN;
    var map = L.mapbox.map('map', 'mapbox.streets')
      .setView([40, -74.50], 9)
      .addControl(L.mapbox.geocoderControl('mapbox.places', {
      autocomplete: true
    }));

    var heat = L.heatLayer([], { maxZoom: 12 }).addTo(map);

    activate();

    function activate() {
      $http.get('/api/coverages')
        .then(function(coveragePoints) {
          vm.coverageFeatures = coveragePoints.data.features;
          vm.coveragePoints = L.geoJson(vm.coverageFeatures, {
            style: function (feature) {
              return {color: feature.properties.color};
            },
            onEachFeature: function (feature, layer) {
              heat.addLatLng(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), feature.properties.wifi[0].signal_level);
              layer.bindPopup(feature.properties.wifi[0].signal_level);
            }
          }).addTo(map);
          socket.syncUpdates('coverage', vm.coverageFeatures, function(event, item ){
            vm.coveragePoints.addData(item);
          });
        })
        .catch(function(ex){
          $log.error(ex);
        });
    }



   //On click get interment data
   map.on('click', function(e) {
    heat.addLatLng(e.latlng);
    var data= {
      type: 'Feature',
      properties: {
        address: '222 Test St',
        floor: 1,
        room: 'Office'
      },
      geometry: {
        type: 'Point',
        coordinates: [
          e.latlng.lng,
          e.latlng.lat
        ]
      }
    };

    $http.post('/api/coverages', data)
      .then(function(res) {
        $log.debug(res)
      })
      .catch(function(err) {
        $log.error(err);
      });

  });



  function deleteCoverage(coverage) {
    $http.delete('/api/coverages/' + coverage._id);
  }

  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('coverage');
  });

}

})();
