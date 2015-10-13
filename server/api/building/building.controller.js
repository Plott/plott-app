'use strict';

var _ = require('lodash');
var Building = require('./building.model');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');

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
  }
  else{
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
exports.upload = function(req, res) {
  var dirname = require('path').dirname(__dirname);
  console.log(req.body);
  console.log(req.file);
  var data = req.body;
  var filename = req.file.filename;
  var path = req.file.path;
  var type = req.file.mimetype;
  var read_stream = fs.createReadStream(path);
  var conn = mongoose.connection;
  var Grid = require('gridfs-stream');
  Grid.mongo = mongoose.mongo;

  var gfs = Grid(conn.db);
  var writestream = gfs.createWriteStream({
    filename: filename
  });
  read_stream.pipe(writestream);

  Building.findOneAndUpdate({'_id': data.bid}, {floorplans: {$push: {bounds: data.bounds, floor_num: data.floor_num, id: req.file.filename}}}, function(err, building) {
    if (err) { console.log('Error', err);return handleError(res, err); }
    console.log('Success', building);
    return res.json(200, building);
  });
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
           var mime = 'image/png';
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
