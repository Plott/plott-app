(function(){
  'use strict';

  angular
    .module('plottAppApp')
    .controller('MapCtrl', MapCtrl);

  MapCtrl.$inject = ['$scope', '$log', '$http', 'socket', 'MAPBOX', 'icons'];

  function MapCtrl($scope, $log, $http, socket, MAPBOX, icons) {
    var vm = this;
    vm.floor = 1;
    vm.building = 'jordanhall';
    vm.coverageFeatures = [];
    vm.deleteCoverage = deleteCoverage;
    vm.tileUri;
    L.mapbox.accessToken = MAPBOX.TOKEN;

    var xMin = 0;
    var xMax = 4800;
    var yMin = -3600;
    var yMax = 0;

    var map = L.map('map', {
      minZoom: 3,
      maxZoom: 5,
      center: [0,0],
      zoom: 3,
      // maxBounds: [[4800, 0],[0, 3600]],
      crs: L.CRS.Simple
    });

    // map.setView([10, 10], 5);
    var _southWest = map.unproject([0, -3600], map.getMaxZoom()-1);
    var _northEast = map.unproject([xMax, 0], map.getMaxZoom()-1);
    $log.debug(_southWest, _northEast);

    var northEast = [0, 375];
    var southWest = [-120, -25]; //lat, lng
    var bounds = new L.LatLngBounds(southWest, northEast);
    map.setMaxBounds(bounds);

    var baseLayers = {
      'Floor 1': L.tileLayer('/api/tiles/jordanhall/1/{z}/{x}/{y}.png', {continuousWorld: true}),
      'Floor 2': L.tileLayer('/api/tiles/jordanhall/2/{z}/{x}/{y}.png', {continuousWorld: true}),
      'Floor 3': L.tileLayer('/api/tiles/jordanhall/3/{z}/{x}/{y}.png', {continuousWorld: true}),
      'Floor 4': L.tileLayer('/api/tiles/jordanhall/4/{z}/{x}/{y}.png', {continuousWorld: true}),
      'Floor 5': L.tileLayer('/api/tiles/jordanhall/5/{z}/{x}/{y}.png', {continuousWorld: true}),
      'Floor 6': L.tileLayer('/api/tiles/jordanhall/6/{z}/{x}/{y}.png', {continuousWorld: true}),
      'Roof': L.tileLayer('/api/tiles/jordanhall/7/{z}/{x}/{y}.png', {continuousWorld: true})
    };
    baseLayers['Floor 1'].addTo(map);
    L.control.layers(baseLayers).addTo(map);

    map.on('baselayerchange', function(e) {
      $log.debug(e);
      vm.floor = e.name !== 'Roof' ? e.name.split(' ')[1] : e.name;
      $scope.$apply();
    });

    var heat = L.heatLayer([], {
      maxZoom: 5,
      radius: 50,
    }).addTo(map);

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
              // heat.addLatLng(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), feature.properties.wifi[0].signal_level);
              // layer.bindPopup(feature.properties.wifi[0].signal_level);
            },
            pointToLayer: function(feature, latlng) {
              return L.marker(latlng, {
                icon: icons.sensor(),
                draggable: true
              });
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
     $log.debug(e);
     $log.debug(map.getBounds());
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
