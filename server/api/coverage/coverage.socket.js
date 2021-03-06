/**
 * Broadcast updates to client when the model changes
 */

'use strict';
// var plott = require('plott');
// var Coverage = plott.mongoModels.FingerPrints;
var Coverage = require('./coverage.model');



exports.register = function(socket) {
  Coverage.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Coverage.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('coverage:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('coverage:remove', doc);
}
