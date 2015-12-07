/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/sensors              ->  index
 */

'use strict';
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
  Sensor.findById(req.params.id, function (err, coverage) {
    if(err) { return handleError(res, err); }
    if(!coverage) { return res.send(404); }
    return res.json(coverage);
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
  Sensor.findById(req.params.id, function (err, coverage) {
    if (err) { return handleError(res, err); }
    if(!coverage) { return res.send(404); }
    var updated = _.merge(coverage, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, coverage);
    });
  });
};

// Deletes a coverage from the DB.
exports.destroy = function(req, res) {
  Sensor.findById(req.params.id, function (err, coverage) {
    if(err) { return handleError(res, err); }
    if(!coverage) { return res.send(404); }
    Sensor.remove(function(err) {
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
