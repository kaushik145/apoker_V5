'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var leftRoomEventHandler = function leftRoomEventHandler(room, eventPayload) {
  return room.update('stories', function (stories) {
    return stories.map(function (story) {
      return story.removeIn(['estimations', eventPayload.userId]);
    });
  }) // remove leaving user's estimations from all stories
  .removeIn(['users', eventPayload.userId]) // then remove user from room
  ;
};

exports.default = leftRoomEventHandler;