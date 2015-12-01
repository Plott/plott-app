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

    var xMin = 0;
    var xMax = 4800;
    var yMin = -3600;
    var yMax = 0;

    // var map = L.mapbox.map('map', 'mapbox.streets')
    //   .setView([40, -74.50], 9)
    //   .addControl(L.mapbox.geocoderControl('mapbox.places', {
    //   autocomplete: true
    // }));

    var map = L.map('map', {
      minZoom: 0,
      maxZoom: 5,
      center: [0,0],
      zoom: 3,
      // maxBounds: [[4800, 0],[0, 3600]],
      crs: L.CRS.Simple
    });

    // map.setView([10, 10], 5);
    // var southWest = map.unproject([0, -3600], map.getMaxZoom()-1);
    // var northEast = map.unproject([xMax, 0], map.getMaxZoom()-1);
    var northEast = [157, 347];
    var southWest = [-346, -280]; //lat, lng
    var bounds = new L.LatLngBounds(southWest, northEast);
    map.setMaxBounds(bounds);

    $log.debug(map.getBounds());

    L.tileLayer('/api/tiles/{z}/{x}/{y}.png', {
      // noWrap: true,
      continuousWorld: true
    }).addTo(map);

    // var heat = L.heatLayer([], { maxZoom: 12 }).addTo(map);

    // activate();

    // function activate() {
    //   $http.get('/api/coverages')
    //     .then(function(coveragePoints) {
    //       vm.coverageFeatures = coveragePoints.data.features;
    //       vm.coveragePoints = L.geoJson(vm.coverageFeatures, {
    //         style: function (feature) {
    //           return {color: feature.properties.color};
    //         },
    //         onEachFeature: function (feature, layer) {
    //           heat.addLatLng(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), feature.properties.wifi[0].signal_level);
    //           layer.bindPopup(feature.properties.wifi[0].signal_level);
    //         }
    //       }).addTo(map);
    //       socket.syncUpdates('coverage', vm.coverageFeatures, function(event, item ){
    //         vm.coveragePoints.addData(item);
    //       });
    //     })
    //     .catch(function(ex){
    //       $log.error(ex);
    //     });
    // }



   //On click get interment data
   map.on('click', function(e) {
     $log.debug(e);
     $log.debug(map.getBounds());
    // heat.addLatLng(e.latlng);
    // var data= {
    //   type: 'Feature',
    //   properties: {
    //     address: '222 Test St',
    //     floor: 1,
    //     room: 'Office'
    //   },
    //   geometry: {
    //     type: 'Point',
    //     coordinates: [
    //       e.latlng.lng,
    //       e.latlng.lat
    //     ]
    //   }
    // };
    //
    // $http.post('/api/coverages', data)
    //   .then(function(res) {
    //     $log.debug(res)
    //   })
    //   .catch(function(err) {
    //     $log.error(err);
    //   });

  });



  function deleteCoverage(coverage) {
    $http.delete('/api/coverages/' + coverage._id);
  }

  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('coverage');
  });

}

})();
