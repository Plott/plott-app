/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/tiles              ->  index
 */

'use strict';
var fs = require('fs');
var path = require('path');

// Gets a list of Tiles
exports.index = function(req, res) {
  var x = req.params.x;
  var y = req.params.y;
  var z = req.params.z;
  var tilePath = path.join(__dirname, '../../tiles/', z, x, y);
  var defaultTilePath = path.join(__dirname, '../../tiles/', '5', '10', '10.png');


  fs.stat(tilePath, function(err, stats) {
    if (err) {
      // console.log(err);
      // var tile = fs.createReadStream(defaultTilePath);
      // tile.pipe(res);
      res.status(404).send('Tile Not Found');
    }
    else {
      var tile = fs.createReadStream(tilePath);
      tile.pipe(res);
    }

  });

};
