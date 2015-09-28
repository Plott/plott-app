'use strict';

angular.module('plottAppApp')
.controller('MapCtrl', function ($scope, $http, socket) {



   L.mapbox.accessToken = 'pk.eyJ1IjoiY3R3aGl0ZSIsImEiOiItb0dqdUlZIn0.4Zb1DGESXnx0ePxMVLihZQ';
      var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([40, -74.50], 9);

     $scope.coverageFeatures = [];

     $scope.coveragePromise = $http.get('/api/coverages')
      .then(function(coveragePoints) {
        $scope.coverageFeatures = coveragePoints.data.features;
        $scope.coveragePoints = L.geoJson($scope.coverageFeatures, {
            style: function (feature) {
                return {color: feature.properties.color};
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.description);
            }
        }).addTo(map);
        console.log(socket);
       socket.syncUpdates('coverage', $scope.coverageFeatures, function(event, item ){
          $scope.coveragePoints.addData(item);
       });
      }).
      catch(function(ex){
        console.log(ex);
      })

   //On click get interment data
   map.on('click', function(e) {
    //  console.log(e);

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
            // $scope.coverageFeatures.push(cov.data);
              // $scope.coveragePoints.addData($scope.coverageFeatures);
           });
   });




 // $scope.addThing = function() {
 //   if($scope.newGrave === '') {
 //     return;
 //   }
 //   $http.post('/api/coverages', { name: $scope.newGrave });
 //   $scope.newGrave = '';
 // };
 //
 $scope.deleteCoverage = function(coverage) {
   $http.delete('/api/coverages/' + coverage._id);
 };

 $scope.$on('$destroy', function () {
   socket.unsyncUpdates('coverage');
 });

});
