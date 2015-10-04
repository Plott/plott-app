(function(){
  'use strict';

  angular
    .module('plottAppApp')
    .controller('BuildingsCtrl', BuildingsCtrl);

    BuildingsCtrl.$inject = ['$scope', '$http', '$log', 'socket', 'MAPBOX', 'Upload', 'building', 'Auth', 'geocoder'];

  function BuildingsCtrl($scope, $http, $log, socket, MAPBOX, Upload, building, Auth, geocoder) {
    var self = this;
    $scope.buildings = [];
    self.user = Auth.getCurrentUser()._id;
    $scope.buildingMarker;
    $scope.reset = reset;
    $scope.addBuilding = building.addBuilding;
    $scope.zoomToBuilding = zoomToBuilding;
    self.reverseGeocoder = geocoder.reverse;

    L.mapbox.accessToken = MAPBOX.TOKEN;
      var map = L.mapbox.map('building-map', 'mapbox.streets')
        .setView([36.84, -95.71], 4)
        .addControl(L.mapbox.geocoderControl('mapbox.places', {
        autocomplete: true
      }));

    map.on('click', function(e){
      if(!$scope.buildingMarker){
        $scope.buildingMarker = L.marker(e.latlng, {
          draggable: true,
          riseOnHover: true,
          icon: L.mapbox.marker.icon({
              'marker-size': 'large',
              'marker-symbol': 'building',
              'marker-color': '#4393B9'
          })
        }).addTo(map);
      }
      else {
        $scope.buildingMarker.setLatLng(e.latlng);
      }
      $scope.building = $scope.buildingMarker.toGeoJSON();
      self.reverseGeocoder(e.latlng.lng, e.latlng.lat)
        .then(setFormGeocode)
        .catch(function(err){
          $log.error(err);
        });
      $scope.$apply();
    });

    building.getUserBuildings(self.user)
      .then(function(buildings){
        var fullAddress;
        $scope.buildings = buildings.data;
        $scope.existingBuildings = L.geoJson($scope.buildings, {
          pointToLayer: L.mapbox.marker.style,
          style: function(feature) {
            return {
              // 'marker-size': 'large',
              // 'marker-symbol': 'building',
              'marker-color': '#fa0'
            };
          },
          onEachFeature: function(feature, layer) {
            fullAddress = '<h3><strong>' + feature.properties.address + '</strong><br>' + feature.properties.city + ', ' + feature.properties.state + ' ' + feature.properties.zip + '</h3>'
            layer.bindPopup(fullAddress);
          }
        }).addTo(map);
        console.log($scope.existingBuildings)
        socket.syncUpdates('building', $scope.buildings, function(event, item){
          $scope.existingBuildings.addData(item);
          $scope.buildings.append(item);
        });
      })
      .catch(function(err){
        $log.error(err);
      });

    function reset() {
      $scope.building = {};
    }

    function zoomToBuilding(geojson) {
      L.geoJson(geojson, {
        coordsToLatLng: function(coords) {
          map.setView([coords[1], coords[0]], 18);
        }
      });
    }

    function setFormGeocode(res) {
      var data = res.data.features[0];
      $scope.building.properties.address = data.address + ' ' + data.text;
      $scope.building.properties.city = data.context[0].text;
      $scope.building.properties.zip = parseInt(data.context[1].text, 10);
      $scope.building.properties.state = data.context[2].text;
    }

  }

})();
