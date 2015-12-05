/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var sensor = require('./sensor.model');

exports.register = function(socket) {
  sensor.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  sensor.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  sensor.emit('sensor:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('sensor:remove', doc);
}
