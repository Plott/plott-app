'use strict';

angular.module('plottAppApp')
  .directive('sensorPopup', function () {
    return {
      templateUrl: 'app/map/sensorPopup/sensorPopup.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
