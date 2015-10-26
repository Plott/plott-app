'use strict';

angular.module('plottAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('map', {
        url: '/map',
        templateUrl: 'app/map/map.html',
        controller: 'MapCtrl',
        controllerAs: 'vm',
        authenticate: true
      });
  });
