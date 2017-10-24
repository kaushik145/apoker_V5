'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var joinedRoomEventHandler = function joinedRoomEventHandler(room, eventPayload) {
  return room.setIn(['users', eventPayload.userId], new _immutable2.default.Map({ id: eventPayload.userId }));
};

exports.default = joinedRoomEventHandler;