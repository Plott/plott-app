'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BuildingSchema = new Schema({
  type: {type: String, default: "Feature"},
  properties: {
    owner: {type: String, required: true},
    group: {type: String},
    address: {type: String, unique : true, required : true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zip: {type: Number, required: true},
    floorplans: [FloorplanSchema],
    createdby: {type: String},
    createdOn: {type: Date, default: Date.now},
    editedBy: {type: String},
    editedOn: {type: Date}
  },
  geometry: {
       type     : { type: String, default: "Point" },
       coordinates: { type: [Number], index: '2dsphere'}
  }
});

var FloorplanSchema = new Schema({
  type: {type: String, default: "Feature"},
  properties: {
    plan_id: {type: Number, unique : true, required: true},
    floor_num: {type: Number, required: true},
    createdby: {type: String},
    createdOn: {type: Date, default: Date.now},
    editedBy: {type: String},
    editedOn: {type: Date}
  },
  geometry: {
    type     : { type: String, default: "Polygon" },
    coordinates: { type: [Number], index: '2dsphere'}
  }
});

module.exports = mongoose.model('Building', BuildingSchema);
