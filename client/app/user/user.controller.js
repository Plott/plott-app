(function(){
  'use strict';

  angular
    .module('plottAppApp')
    .controller('UserCtrl', UserCtrl);

    UserCtrl.$inject = ['$scope','$state', 'Auth'];

  function UserCtrl($scope, $state, Auth) {
    var self = this;

    self.user = Auth.getCurrentUser().name;
    $scope.changeView = changeView;

    function changeView(view) {
      $state.go(view, {id: self.user});
    }
  };
})();
