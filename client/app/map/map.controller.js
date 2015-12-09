(function(){
  'use strict';

  angular
    .module('plottAppApp')
    .controller('MapCtrl', MapCtrl);

  MapCtrl.$inject = ['$scope', '$log', '$http', 'socket', 'MAPBOX', 'icons', '$compile', 'sensorService'];

  function MapCtrl($scope, $log, $http, socket, MAPBOX, icons, $compile, sensorService) {
    var vm = this;
    vm.floor = 1;
    vm.sensors = 0;
    vm.building = 'jordanhall';
    vm.sensorFeatures = [];
    vm.tileUri;
    vm.addSensor = false;
    L.mapbox.accessToken = MAPBOX.TOKEN;

    var map = L.map('map', {
      minZoom: 2,
      maxZoom: 5,
      center: [0,0],
      zoom: 3,
      crs: L.CRS.Simple
    });

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

      sensorService.byFloor(vm.building, vm.floor)
        .then(getSensors)
        .catch(handleError);
    });

    var heat = L.heatLayer([], {
      maxZoom: 5,
      radius: 50,
    }).addTo(map);

    L.Control.SensorControl = L.Control.extend({
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
          $scope.$apply();
        });
        return container;
      }
    });

    L.control.sensor = function () {
      return new L.Control.SensorControl();
    }

    L.control.sensor().addTo(map);

    activate();

    function activate() {
      sensorService.byFloor(vm.building, vm.floor)
        .then(getSensors)
        .then(setSensorSocket)
        .catch(handleError);
    }

    function sensorPopup (feature, layer) {
      var html = "<sensor-popup data='feature'></sensor-popup>",
      linkFunction = $compile(angular.element(html)),
      newScope = $scope.$new();
      newScope.feature = feature;
      // heat.addLatLng(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), feature.properties.wifi[0].signal_level);
      layer.bindPopup(linkFunction(newScope)[0], {
        minWidth: 200,
        keepInView: true
      });
    }

    function sensorMarker (feature, latlng) {
      feature.properties.status = feature.properties.active ? 'ready' : 'off';
      var sensor = L.marker(latlng, {
        icon: icons.sensor(feature.properties.status),
        draggable: true
      });

      sensor.on('dragend', function(e) {
        var geo = e.target.getLatLng();
        var feature = e.target.feature;
        var data = angular.extend(feature, {
          geometry: {
            coordinates: [geo.lng, geo.lat],
            type: "Point"
          }
        });

      //  heat.addLatLng(e.latlng);
       $http.put('/api/sensors/' + data._id, data)
         .then(function(res) {
           $log.debug('Sensor PUT:', res.status, res)
         })
         .catch(function(err) {
           $log.error('Sensor PUT:',err.status);
         });
      });

      return sensor;
    }

    function getSensors(res) {
      $log.debug('Sensor GET:', res.status, res);
      vm.sensorFeatures = res.data.features;
      if(vm.sensorPoints){
        vm.sensorPoints.clearLayers();
      }

      vm.sensorPoints = L.geoJson(vm.sensorFeatures, {
        onEachFeature: sensorPopup,
        pointToLayer: sensorMarker,
      }).addTo(map);
      return vm.sensorPoints;
    }

    function setSensorSocket() {
      socket.syncUpdates('sensor', vm.sensorFeatures, function(event, item ){
        switch (event) {
          case 'created':
            $log.debug('Created Event:', item, typeof item.properties.floor, typeof vm.floor)
            if(item.properties.floor == vm.floor){
              vm.sensorPoints.addData(item);
            }
            break;
          case 'updated':
            vm.sensorPoints.eachLayer(function(l){
              if(item.properties.floor == vm.floor){
                if(l.feature._id === item._id) {
                  vm.sensorPoints.removeLayer(l);
                  vm.sensorPoints.addData(item);
                }
              }
            });
            break;
          case 'deleted':
            vm.sensorPoints.eachLayer(function(l){
              if(l.feature._id === item._id) {
                vm.sensorPoints.removeLayer(l);
              }
            });
            break;
          default:

        }
      });
    }

    map.on('click', function(e) {
      if (vm.addSensor) {
        var data = {
          properties: {
            name: vm.sensorName,
            building: vm.building,
            floor: vm.floor,
            active: vm.selectedActive,
            status: vm.selectedStatus || 'off'
          },
          geometry: {
            coordinates: [e.latlng.lng, e.latlng.lat]
          }
        };
      //  heat.addLatLng(e.latlng);
        $http.post('/api/sensors', data)
          .then(function(res) {
            $log.debug('Sensor Post:', res.status, res)
            //  vm.sensorPoints.addData(res.data);
          })
          .catch(handleError);
      }
    });

   $scope.$on('$destroy', function () {
     socket.unsyncUpdates('sensor');
   });

   function handleError(err) {
     $log.error(err);
   }
 }



})();
