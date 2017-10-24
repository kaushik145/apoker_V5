'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var storyDeletedEventHandler = function storyDeletedEventHandler(room, eventPayload) {
  return room.removeIn(['stories', eventPayload.storyId]);
};

exports.default = storyDeletedEventHandler;