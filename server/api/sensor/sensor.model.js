'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SensorSchema = new Schema({
  type: {type: String, default: 'Feature'},
  properties: {
    name: String,
    building: String,
    floor: Number,
    active: {type:Boolean, default: false},
    status: {type: String, default: 'off'},
  },
  geometry: {
       type: {type: String, default: 'Point'},
       coordinates: { type: [Number], index: '2dsphere'}
  },
  meta: {
    createdAt: {type: Date, default: Date.now},
    createdBy: String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: String,
  }
});


SensorSchema.pre('update', function() {
  this.update({},{ meta: {$set: { updatedAt: Date.now } }});
});

module.exports = mongoose.model('Sensor', SensorSchema);
