'use strict';

var _ = require('lodash');
var Coverage = require('./coverage.model');

// Get list of coverages
exports.index = function(req, res) {
  Coverage.find(function (err, coverages) {
    if(err) { return handleError(res, err); }
    return res.json(200, coverages);
  });
};

// Get a single coverage
exports.show = function(req, res) {
  Coverage.findById(req.params.id, function (err, coverage) {
    if(err) { return handleError(res, err); }
    if(!coverage) { return res.send(404); }
    return res.json(coverage);
  });
};

// Creates a new coverage in the DB.
exports.create = function(req, res) {
  Coverage.create(req.body, function(err, coverage) {
    if(err) { return handleError(res, err); }
    return res.json(201, coverage);
  });
};

// Updates an existing coverage in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Coverage.findById(req.params.id, function (err, coverage) {
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
  Coverage.findById(req.params.id, function (err, coverage) {
    if(err) { return handleError(res, err); }
    if(!coverage) { return res.send(404); }
    coverage.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}