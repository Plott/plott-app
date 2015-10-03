'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BuildingSchema = new Schema({
  owner: Number,
  address: String,
  floorplans: [
    {
      plan_id: {type: Number, required: true},
      floor_num: {type: Number, required: true},
      createdby: {type: String},
      createdOn: {type: Date},
      editedBy: {type: String},
      editedOn: {type: Date}
    }
  ],
  createdby: {type: String},
  createdOn: {type: Date},
  editedBy: {type: String},
  editedOn: {type: Date}
});

module.exports = mongoose.model('Building', BuildingSchema);
