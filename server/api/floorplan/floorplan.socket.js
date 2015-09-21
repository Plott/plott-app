/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Floorplan = require('./floorplan.model');

exports.register = function(socket) {
  Floorplan.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Floorplan.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('floorplan:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('floorplan:remove', doc);
}