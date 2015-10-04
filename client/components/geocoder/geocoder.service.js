/**
 * Geocoder Factory
 * @namespace Factories
 */


(function(){
  'use strict';

  angular
    .module('plottAppApp')
    .factory('geocoder', geocoder);

  function geocoder($http, MAPBOX, $q) {
    var self = this;
    self.token = MAPBOX.TOKEN;
    self.uri = 'https://api.mapbox.com/v4/geocode/mapbox.places/'
    var service = {
      reverse: reverse
    };
    return service;

    function reverse(lon, lat, callback) {
      var cb = callback || angular.noop;
      var deferred = $q.defer();
      var uri = self.uri + lon + ',' + lat + '.json?access_token=' + self.token;
      $http.get(uri)
        .then(function(res){
          deferred.resolve(res);
          return cb(res);
        })
        .catch(function(err){
          deferred.reject(err);
          return cb(err);
        });
        return deferred.promise;
    }
  }
})();
