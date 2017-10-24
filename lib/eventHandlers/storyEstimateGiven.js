'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var storyEstimateGivenEventHandler = function storyEstimateGivenEventHandler(room, eventPayload) {
  return room.setIn(['stories', eventPayload.storyId, 'estimations', eventPayload.userId], eventPayload.value);
};

exports.default = storyEstimateGivenEventHandler;