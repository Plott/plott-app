(function() {
  'use strict';

  angular
    .module('plottAppApp')
    .directive('sensorPopup', sensorPopup);

  sensorPopup.$inject = ['$log'];

  function sensorPopup() {
    var directive = {
      templateUrl: 'app/map/sensorPopup/sensorPopup.html',
      restrict: 'E',
      link: link,
      controller: controller,
      controllerAs: 'vm',
      bindToController: true,
      transclude: true,
      scope: {

      }
    };

    return directive;

    function controller() {

    }

    function link() {

    }
  }
})();
