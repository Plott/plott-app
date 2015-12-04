/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/tiles              ->  index
 */

'use strict';
var fs = require('fs');
var path = require('path');

// Gets a list of Tiles
exports.index = function(req, res) {
  var building = req.params.building; //Building id
  var floor = req.params.floor; //Floor id
  var x = req.params.x; //x coordinate
  var y = req.params.y; //y coordinate
  var z = req.params.z; //zoom level
  var tilePath = path.join(__dirname, '../../tiles/', building, floor, z, x, y);
  fs.stat(tilePath, function(err, stats) {
    if (err) {
      res.status(404).send('Tile not Found');
    }
    else {
      var tile = fs.createReadStream(tilePath);
      tile.pipe(res);
    }

  });

};
