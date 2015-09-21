'use strict';

var _ = require('lodash');
var Floorplan = require('./floorplan.model');

// Get list of floorplans
exports.index = function(req, res) {
  Floorplan.find(function (err, floorplans) {
    if(err) { return handleError(res, err); }
    return res.json(200, floorplans);
  });
};

// Get a single floorplan
exports.show = function(req, res) {
  Floorplan.findById(req.params.id, function (err, floorplan) {
    if(err) { return handleError(res, err); }
    if(!floorplan) { return res.send(404); }
    return res.json(floorplan);
  });
};

// Creates a new floorplan in the DB.
exports.create = function(req, res) {
  Floorplan.create(req.body, function(err, floorplan) {
    if(err) { return handleError(res, err); }
    return res.json(201, floorplan);
  });
};

// Updates an existing floorplan in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Floorplan.findById(req.params.id, function (err, floorplan) {
    if (err) { return handleError(res, err); }
    if(!floorplan) { return res.send(404); }
    var updated = _.merge(floorplan, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, floorplan);
    });
  });
};

// Deletes a floorplan from the DB.
exports.destroy = function(req, res) {
  Floorplan.findById(req.params.id, function (err, floorplan) {
    if(err) { return handleError(res, err); }
    if(!floorplan) { return res.send(404); }
    floorplan.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}