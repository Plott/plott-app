(function(){
  'use strict';

  angular
    .module('plottAppApp')
    .controller('BuildingsCtrl', BuildingsCtrl);

    BuildingsCtrl.$inject = ['$scope', '$http', '$log', 'socket', 'MAPBOX', 'Upload', 'building', 'Auth', 'geocoder'];

  function BuildingsCtrl($scope, $http, $log, socket, MAPBOX, Upload, building, Auth, geocoder) {
    var self = this;
    $scope.featureGroup = L.featureGroup();
    $scope.buildings = [];
    self.user = Auth.getCurrentUser()._id;
    $scope.buildingMarker;
    $scope.reset = reset;
    $scope.formHeading = 'Add Building';
    $scope.addBuilding = building.addBuilding;
    $scope.zoomToBuilding = zoomToBuilding;
    self.reverseGeocoder = geocoder.reverse;
    $scope.upload = upload;
    $scope.addImageToMap = addImageToMap;
    L.TileLayer.prototype.options.maxZoom = 22;
    L.mapbox.accessToken = MAPBOX.TOKEN;
      var map = L.mapbox.map('building-map', 'mapbox.streets', {tileLayer: {maxZoom: 22}})
        .setView([36.84, -95.71], 4)
        .addControl(L.mapbox.geocoderControl('mapbox.places', {
          autocomplete: true
        }));

    var drawControl = new L.Control.Draw({
      edit: {
        featureGroup: $scope.featureGroup,
        remove: false
      },
      draw: false
    }).addTo(map);

    map.on('draw:edited', georeferenceFloorplan);

    map.on('click', function(e){
      switch($scope.formHeading) {
        case 'Add Building':
          addBuildingToMap(e);
          break;
        case 'Add Floorplan':
          map.removeLayer($scope.buildingMarker);
          $scope.featureGroup.addTo(map);
          georeferenceFloorplan();
          break;
        default:
          return;
      }

    });

    building.getUserBuildings(self.user)
      .then(function(buildings){
        var fullAddress;
        $scope.buildings = buildings.data;
        $scope.existingBuildings = L.geoJson($scope.buildings, {
          pointToLayer: L.mapbox.marker.style,
          style: function(feature) {
            return {
              'marker-size': 'large',
              'marker-symbol': 'building',
              'marker-color': '#fa0'
            };
          },
          onEachFeature: function(feature, layer) {
            fullAddress = '<h3><strong>' + feature.properties.address + '</strong><br>' +
              feature.properties.city + ', ' + feature.properties.state + ' ' + feature.properties.zip + '</h3>' +
              '<a href="' + feature._id + '">Add Floorplan</a>' ;
            layer.bindPopup(fullAddress);
          }
        }).addTo(map);
        socket.syncUpdates('building', $scope.buildings, function(event, item){
          $scope.existingBuildings.addData(item);
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
      $scope.viewFloorplans = true;
      $scope.formHeading = 'Add Floorplan';
      $scope.selectedBuilding = geojson;
    }

    function setFormGeocode(res) {
      var data = res.data.features[0];
      $scope.building.properties.address = data.address + ' ' + data.text;
      $scope.building.properties.city = data.context[1].text;
      $scope.building.properties.zip = parseInt(data.context[2].text, 10);
      $scope.building.properties.state = data.context[3].text;
      $scope.building.properties.bbox = data.bbox;
    }

    function addBuildingToMap(e) {
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
    }

    function addImageToMap(file) {
      var bounds = setImageBounds($scope.selectedBuilding.properties.bbox) || map.getBounds();
      var imageUrl = '/assets/images/jh1.png'; //file.$ngfBlobUrl,
      $scope.overlay = L.imageOverlay(imageUrl, bounds).addTo(map);
    }

    function setImageBounds(bbox) {
      if (bbox){
        // $scope.sw = L.marker([bbox[1], bbox[0]], {
        //   draggable: true,
        //   icon: L.mapbox.marker.icon({
        //       'marker-size': 'small',
        //       'marker-color': '#01abfb' //blue
        //   })
        // }).addTo(map);
        //
        // $scope.ne = $scope.sw = L.marker([bbox[3], bbox[2]],{
        //     draggable: true,
        //     icon: L.mapbox.marker.icon({
        //       'marker-size': 'small',
        //       'marker-color': '#01abfb' //red
        //     })
        // }).addTo(map);
        //
        // $scope.nw = L.marker([bbox[3], bbox[0]],{
        //   icon: L.mapbox.marker.icon({
        //     'marker-size': 'small',
        //     'marker-color': '#01abfb' //purple
        //   })
        // }).addTo(map);
        //
        // $scope.se = L.marker([bbox[1], bbox[2]],{
        //   icon: L.mapbox.marker.icon({
        //     'marker-size': 'small',
        //     'marker-color': '#01abfb' //green
        //   })
        // }).addTo(map);
        // console.log($scope.sw.getLatLng());
        $scope.imagePoly = L.polygon([[bbox[1], bbox[0]],[bbox[1], bbox[2]], [bbox[3], bbox[2]],[bbox[3], bbox[0]]])
        // $scope.imagePoly = L.polygon($scope.sw.getLatLng(), $scope.se.getLatLng(), $scope.ne.getLatLng(), $scope.nw.getLatLng());

        $scope.featureGroup.addLayer($scope.imagePoly);
        $scope.featureGroup.addTo(map);
        return L.latLngBounds([[bbox[1], bbox[0]],[bbox[3], bbox[2]]]);
        // return L.latLngBounds($scope.sw.getLatLng(), $scope.ne.getLatLng());
      }
      else{
        return false;
      }
    }

    function georeferenceFloorplan(e) {
      e.layers.eachLayer(function(layer) {
        // console.log($scope.overlay);
        // $scope.overlay.setBounds(layer.getBounds());
        $scope.overlay._bounds = layer.getBounds();
        $scope.overlay._reset();
      });
    }

    function upload(file) {
       Upload.upload({
           url: 'api/buildings/upload',
           data: {file: file, 'username': $scope.username}
       }).then(function (resp) {
           console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
       }, function (resp) {
           console.log('Error status: ' + resp.status);
       }, function (evt) {
           var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
           console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
       });
   };

  }

})();
