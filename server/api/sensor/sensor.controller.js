/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/sensors              ->  index
 */

'use strict';

// Gets a list of Sensors
exports.index = function(req, res) {
  res.json([]);
};
