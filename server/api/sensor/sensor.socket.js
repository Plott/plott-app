/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Sensor = require('./sensor.model');

exports.register = function(socket) {
  Sensor.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Sensor.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('sensor:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('sensor:remove', doc);
}
