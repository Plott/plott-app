'use strict';

var _ = require('lodash');
var Building = require('./building.model');

// Get list of buildings
exports.index = function(req, res) {
  Building.find(function (err, buildings) {
    if(err) { return handleError(res, err); }
    return res.json(200, buildings);
  });
};

// Get a single building
exports.show = function(req, res) {
  console.log(req.query);
  if (req.query.multi === 'true'){
    console.log(req.params.id)
    Building.find({'properties.owner': req.params.id}, function (err, buildings) {
      if(err) { return handleError(res, err); }
      return res.json(200, buildings);
    });
  }else{
    console.log('No Beans')
    Building.findById(req.params.id, function (err, building) {
      if(err) { return handleError(res, err); }
      if(!building) { return res.send(404); }
      return res.json(building);
    });
  }
};

// Creates a new building in the DB.
exports.create = function(req, res) {
  Building.create(req.body, function(err, building) {
    if(err) { return handleError(res, err); }
    return res.json(201, building);
  });
};

// Updates an existing building in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Building.findById(req.params.id, function (err, building) {
    if (err) { return handleError(res, err); }
    if(!building) { return res.send(404); }
    var updated = _.merge(building, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, building);
    });
  });
};

// Deletes a building from the DB.
exports.destroy = function(req, res) {
  Building.findById(req.params.id, function (err, building) {
    if(err) { return handleError(res, err); }
    if(!building) { return res.send(404); }
    building.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
