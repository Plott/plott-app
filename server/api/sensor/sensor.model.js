'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SensorSchema = new Schema({
  name: String,
  building: String,
  geo: {
       coordinates: { type: [Number], index: '2dsphere'}
  },
  active: Boolean,
  status: String,
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
