'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  This is the non-persistent (in-memory) roomsStore implementation.
 *  Switch between persistent / non-persistent store is done in settings.js
 */

var rooms = new _immutable2.default.Map();

exports.default = {
  init: init,
  getRoomById: getRoomById,
  saveRoom: saveRoom,
  getAllRooms: getAllRooms
};


function init() {
  // nothing to do here
}

function getRoomById(roomId) {
  return _bluebird2.default.resolve(rooms.get(roomId));
}

function saveRoom(room) {
  rooms = rooms.set(room.get('id'), room);
  return _bluebird2.default.resolve();
}

function getAllRooms() {
  return _bluebird2.default.resolve(rooms);
}