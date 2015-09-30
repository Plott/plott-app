'use strict';

angular.module('plottAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/user/:id',
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl',
        auth: true
      });
  });
