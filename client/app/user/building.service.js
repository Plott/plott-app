/**
 * Building Factory
 * @namespace Factories
 */

(function(){
  'use strict';

  angular
    .module('plottAppApp')
    .factory('building', building);

  /**
   * @namespace Building
   * @desc Application wide building service
   * @memberOf Factories
   */
  function building($http, Auth, $q) {
    var self = this;
    var service = {
      getAllBuildings: getAllBuildings,
      getUserBuilding: getUserBuilding,
      getUserBuildings: getUserBuildings,
      addBuilding: addBuilding,
      updateBuilding: updateBuilding,
      deleteBuilding: deleteBuilding,
      getFloorplan: getFloorplan,
      addFloorplan: addFloorplan,
      updateFloorplan: updateFloorplan,
      deleteFloorplan: deleteFloorplan
    };
    return service;

    /**
     * @name getAllBuilding
     * @desc Gets all buildings
     * @returns {HttpPromise}
     * @memberOf Factories.Building
     */
    function getAllBuildings(callback) {
      var cb = callback || angular.noop;
      var deferred = $q.defer();
      $http.get('/api/buildings')
        .then(function(res) {
          deferred.resolve(res);
          return cb(res);
        })
        .catch(function(err) {
          deferred.reject(err);
          return cb(err);
        });
        return deferred.promise;
    }

    /**
     * @name getUserBuildings
     * @desc Gets all buildings from specified user
     * @returns {HttpPromise}
     * @memberOf Factories.Building
     */
    function getUserBuildings(user, callback) {
      var cb = callback || angular.noop;
      var deferred = $q.defer();
      var config = {
        params: {
          multi: true
        }
      };
      $http.get('/api/buildings/' + user, config)
        .then(function(res) {
          deferred.resolve(res);
          return cb();
        })
        .catch(function(err) {
          deferred.reject(err);
          return cb(err);
        });
        return deferred.promise;
    }

    /**
     * @name getUserBuilding
     * @desc Gets a building from specified user
     * @param {number} userid - users unquie id
     * @returns {HttpPromise}
     * @memberOf Factories.Building
     */
    function getUserBuilding() {

    }

    /**
     * @name addBuilding
     * @desc Adds building to database
     * @param {number} userid - users unquie id
     * @returns {HttpPromise}
     * @memberOf Factories.Building
     */
    function addBuilding(data, callback) {
      var cb = callback || angular.noop;
      var deferred = $q.defer();
      var user = Auth.getCurrentUser();
      data.properties.owner = user._id;
      data.properties.createdby = user.name;

      $http.post('/api/buildings', data)
        .then(function(res) {
          deferred.resolve(res);
          return cb();
        })
        .catch(function(err) {
          deferred.reject(err);
          return cb(err);
        });
        return deferred.promise;
    }

    function updateBuilding() {

    }

    function deleteBuilding() {

    }

    function getFloorplan() {

    }

    function addFloorplan(data, callback) {
      var cb = callback || angular.noop;
      var deferred = $q.defer();
      var user = Auth.getCurrentUser();
      data.properties.owner = user._id;
      data.properties.createdby = user.name;

      $http.post('/api/buildings/upload', data)
        .then(function(res) {
          deferred.resolve(res);
          return cb();
        })
        .catch(function(err) {
          deferred.reject(err);
          return cb(err);
        });
        return deferred.promise;
    }

    function updateFloorplan() {

    }

    function deleteFloorplan() {

    }




  }

})();
