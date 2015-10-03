/**
 * Building Factory
 * @namespace Factories
 */

(function(){
  'use strict';

  angular
    .module('plottAppApp')
    .factory('buildingService', buildingService);

  function buildingService() {
    var self = this;
    var service = {
      getAllBuildings: getAllBuildings,
      getBuilding: getBuilding,
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
    function getAllBuildings() {

    }

    /**
     * @name getBuilding
     * @desc Gets all buildings from specified user
     * @param {number} userid - users unquie id
     * @returns {HttpPromise}
     * @memberOf Factories.Building
     */
    function getBuilding(user_id) {

    }

    /**
     * @name addBuilding
     * @desc Adds building to database
     * @param {number} userid - users unquie id
     * @returns {HttpPromise}
     * @memberOf Factories.Building
     */
    function addBuilding(user_id) {

    }

    function updateBuilding() {

    }

    function deleteBuilding() {

    }

    function getFloorplan() {

    }

    function addFloorplan() {

    }

    function updateFloorplan() {

    }

    function deleteFloorplan() {

    }




  }

})();
