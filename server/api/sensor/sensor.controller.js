/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/sensors              ->  index
 */

'use strict';
var _ = require('lodash');
var Sensor = require('./sensor.model');


// Gets a list of Sensors
exports.index = function(req, res) {
  Sensor.find(function (err, sensors) {
    if(err) { return handleError(res, err); }
    sensors =toFeatureCollection(sensors);
    return res.json(200, sensors);
  });
};

// Get a single coverage
exports.show = function(req, res) {
  Sensor.findById(req.params.id, function (err, sensor) {
    if(err) { return handleError(res, err); }
    if(!sensor) { return res.send(404); }
    sensors =toFeatureCollection(sensors);
    return res.json(sensor);
  });
};

// Get a all sensors on a particular buildings floor
exports.findFloor = function(req, res) {
  var building = req.query.building;
  var floor = req.query.floor;
  Sensor.find({'properties.building': building, 'properties.floor': floor}, function (err, sensors) {
    if(err) { return handleError(res, err); }
    if(!sensors) { return res.send(404); }
    sensors =toFeatureCollection(sensors);
    return res.json(200, sensors);
  });
};

// Creates a new coverage in the DB.
exports.create = function(req, res) {
  Sensor.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

// Updates an existing coverage in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Sensor.findById(req.params.id, function (err, sensor) {
    if (err) { return handleError(res, err); }
    if(!sensor) { return res.send(404); }
    var updated = _.merge(sensor, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, sensor);
    });
  });
};

// Deletes a coverage from the DB.
exports.destroy = function(req, res) {
  Sensor.findById(req.params.id, function (err, sensor) {
    if(err) { return handleError(res, err); }
    if(!sensor) { return res.send(404); }
    sensor.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

function toFeatureCollection(features){
  return {
    "type": "FeatureCollection",
    "features": features
  };
}
