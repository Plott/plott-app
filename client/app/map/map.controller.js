(function(){
  'use strict';

  angular
    .module('plottAppApp')
    .controller('MapCtrl', MapCtrl);

  MapCtrl.$inject = ['$scope', '$http', 'socket', 'MAPBOX'];

  function MapCtrl($scope, $http, socket, MAPBOX) {
    var self = this;

    self.coverageFeatures = [];
    self.deleteCoverage = deleteCoverage;

    L.mapbox.accessToken = MAPBOX.TOKEN;
      var map = L.mapbox.map('map', 'mapbox.streets')
        .setView([40, -74.50], 9)
        .addControl(L.mapbox.geocoderControl('mapbox.places', {
        autocomplete: true
      }));

    var heat = L.heatLayer([], { maxZoom: 12 }).addTo(map);

     $scope.coveragePromise = $http.get('/api/coverages')
      .then(function(coveragePoints) {
        self.coverageFeatures = coveragePoints.data.features;
        $scope.coveragePoints = L.geoJson(self.coverageFeatures, {
            style: function (feature) {
                return {color: feature.properties.color};
            },
            onEachFeature: function (feature, layer) {
              console.log(feature);

              heat.addLatLng(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), feature.properties.wifi[0].signal_level);
                layer.bindPopup(feature.properties.wifi[0].signal_level);
            }
        }).addTo(map);
       socket.syncUpdates('coverage', self.coverageFeatures, function(event, item ){
          $scope.coveragePoints.addData(item);
       });
      }).
      catch(function(ex){
        console.log(ex);
      })

   //On click get interment data
   map.on('click', function(e) {
     console.log(e);
     heat.addLatLng(e.latlng);
          var data= {
              "type": "Feature",
              "properties": {
                "address": "222 Test St",
                "floor": 1,
                "room": "Office"
              },
              "geometry": {
                   "type":  "Point" ,
                   "coordinates": [
                      e.latlng.lng,
                      e.latlng.lat
                    ]
              }
           };

         $http.post('/api/coverages', data)
           .then(function(cov) {

           });
   });



function deleteCoverage(coverage) {
   $http.delete('/api/coverages/' + coverage._id);
 };

 $scope.$on('$destroy', function () {
   socket.unsyncUpdates('coverage');
 });

  }

})();
