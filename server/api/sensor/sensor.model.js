'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SensorSchema = new Schema({
  type: {type: String, default: 'Feature'},
  properties: {
    name: String,
    building: String,
    floor: Number,
    host: String,
    ip: String,
    mac: String,
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


SensorSchema.pre('save', function(next) {
  this.meta.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Sensor', SensorSchema);
