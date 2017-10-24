'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// here we create the room object
var roomCreatedEventHandler = function roomCreatedEventHandler(room, eventPayload) {
  return _immutable2.default.fromJS({
    id: eventPayload.id,
    users: {},
    stories: {},
    created: new Date().getTime()
  });
};

exports.default = roomCreatedEventHandler;