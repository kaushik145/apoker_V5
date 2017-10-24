'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var newEstimationRoundStartedEventHandler = function newEstimationRoundStartedEventHandler(room, eventPayload) {
  return room.setIn(['stories', eventPayload.storyId, 'estimations'], new _immutable2.default.Map()).setIn(['stories', eventPayload.storyId, 'revealed'], false);
};

exports.default = newEstimationRoundStartedEventHandler;