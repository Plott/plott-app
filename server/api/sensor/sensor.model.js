'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SensorSchema = new Schema({
  name: String,
  location: String,
  geo: {
       coordinates: { type: [Number], index: '2dsphere'}
  },
  active: Boolean
});

module.exports = mongoose.model('Sensor', SensorSchema);
