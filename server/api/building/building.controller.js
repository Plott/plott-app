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
  if (req.query.multi === 'true'){
    Building.find({'properties.owner': req.params.id}, function (err, buildings) {
      if(err) { return handleError(res, err); }
      return res.json(200, buildings);
    });
  }else{
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

//Adds floorplan to project
exports.addFloorplan = function(req, res) {
  var dirname = require('path').dirname(__dirname);
  var filename = req.files.file.name;
  var path = req.files.file.path;
  var type = req.files.file.mimetype;
  var read_stream = fs.createReadStream(dirname + '/' + path);
  var conn = req.conn;
  var Grid = require('gridfs-stream');

  Grid.mongo = mongoose.mongo;

  var gfs = Grid(conn.db);

  var writestream = gfs.createWriteStream({
    filename: filename
  });

  read_stream.pipe(writestream);
};

//Adds floorplan to project
exports.getFloorplan = function(req, res) {
  var pic_id = req.param('id');
     var gfs = req.gfs;

      gfs.files.find({filename: pic_id}).toArray(function (err, files) {

       if (err) {
           res.json(err);
       }
       if (files.length > 0) {
           var mime = 'image/jpeg';
           res.set('Content-Type', mime);
           var read_stream = gfs.createReadStream({filename: pic_id});
           read_stream.pipe(res);
       } else {
           res.json('File Not Found');
       }
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
