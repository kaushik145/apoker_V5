'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var storySelectedEventHandler = function storySelectedEventHandler(room, eventPayload) {
  return room.set('selectedStory', eventPayload.storyId);
};

exports.default = storySelectedEventHandler;