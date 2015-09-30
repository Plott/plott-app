(function(){
  'use strict';

  angular
    .module('plottAppApp')
    .controller('UserCtrl', UserCtrl);

    UserCtrl.$inject = ['$scope','$state', 'Auth'];

  function UserCtrl($scope, $state, Auth) {
    var self = this;

    self.user = Auth.getCurrentUser()._id;
    self.message = 'Hello';
    $scope.changeView = changeView;

    function changeView(view) {
      console.log(view)
      // $location.path('/user/' + self.user + '/' + view);
      $state.go('buildings', {id: self.user});
    }
  };
})();
