'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var storyEstimateClearedEventHandler = function storyEstimateClearedEventHandler(room, eventPayload) {
  return room.removeIn(['stories', eventPayload.storyId, 'estimations', eventPayload.userId]);
};

exports.default = storyEstimateClearedEventHandler;