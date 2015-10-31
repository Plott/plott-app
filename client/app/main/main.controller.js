(function() {
  'use strict';

  angular
    .module('plottAppApp')
    .controller('MainCtrl', MainCtrl)

    MainCtrl.$inject = ['$location'];

    function MainCtrl($location) {
      var vm = this;
      vm.signup = signup;

      function signup() {
        $location.path('/signup');
      }

    }
})();
