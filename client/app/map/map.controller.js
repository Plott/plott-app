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
    vm.sensorFeatures = [];
    vm.deleteSensor = deleteSensor;
    vm.tileUri;
    vm.addSensor = false;
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


    //Add Map edit table
    var sensorControl = L.Control.extend({
      options: {
        position: 'topleft'
      },

      onAdd: function (map) {
        var container = L.DomUtil.get('sensorControl');
        // Disable dragging when user's cursor enters the element

        L.DomEvent
            .addListener(container, 'click', L.DomEvent.stopPropagation)
            .addListener(container, 'click', L.DomEvent.preventDefault);

        container.addEventListener('mouseover', function () {
            map.dragging.disable();
        });
        // Re-enable dragging when user's cursor leaves the element
        container.addEventListener('mouseout', function () {
            map.dragging.enable();
        });

        container.addEventListener('click', function () {
          vm.addSensor = vm.addSensor ? false : true;
          $log.debug('Sensor Button Click:', vm.addSensor);
          $scope.$apply();
        });
        return container;
      }
    });

    map.addControl(new sensorControl());

    activate();

    function activate() {
      $http.get('/api/sensors')
        .then(function(sensorPoints) {
          vm.sensorFeatures = sensorPoints.data.features;
          $log.debug('SensorFeatures:', vm.sensorFeatures);
          vm.sensorPoints = L.geoJson(vm.sensorFeatures, {
            onEachFeature: function (feature, layer) {
              // heat.addLatLng(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), feature.properties.wifi[0].signal_level);
              layer.bindPopup('<h1>' + feature.properties.active + '</h1>');
            },
            pointToLayer: sensorMarker
          }).addTo(map);
          $log.debug('Socket.io', socket)
          return vm.sensorPoints;
        })
        .then(function() {
          socket.syncUpdates('sensor', vm.sensorFeatures, function(event, item ){
            $log.debug('Socket Sensor Event', event, item);
            vm.sensorPoints.addData(item);
          });
        })
        .catch(function(err){
          $log.error(err);
        });
    }



    function sensorMarker (feature, latlng) {
      var sensor = L.marker(latlng, {
        icon: icons.sensor(),
        draggable: true
      });

      sensor.on('dragend', function(e){
        $log.debug('Sensor Dragend', e);
      });

      return sensor;
    }




      map.on('click', function(e) {
        // $log.debug('Add Sensor Event', e)
        if (vm.addSensor) {
          var data = {
            name: vm.sensorName,
            building: vm.building,
            floor: vm.floor,
            geometry: {
              coordinates: [e.latlng.lng, e.latlng.lat]
            },
            active: vm.selectedActive,
            status: vm.selectedStatus || 'off'
          };
        //  heat.addLatLng(e.latlng);
         $http.post('/api/sensors', data)
           .then(function(res) {
             $log.debug('Sensors Post Success:', res)
            //  vm.sensorPoints.addData(res.data);
           })
           .catch(function(err) {
             $log.error('Sensor Post Fail',err);
           });
       }
     });


   //On click get interment data




  function deleteSensor(sensors) {
    $http.delete('/api/sensors/' + sensors._id);
  }

  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('sensor');
  });

}



})();
