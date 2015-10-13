'use strict';

angular.module('plottAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('buildings', {
        url: '/user/buildings',
        templateUrl: 'app/user/buildings.html',
        controller: 'BuildingsCtrl',
        authenticated: true
      });
  });
