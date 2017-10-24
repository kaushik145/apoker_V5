'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _uuid = require('uuid');

/**
 * A user adds a story to the estimation backlog of the room
 */
var addStoryCommandHandler = {
  existingRoom: true,
  preCondition: function preCondition(room, command, userId) {
    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot add stories!');
    }
  },
  fn: function fn(room, command) {

    var newStoryId = (0, _uuid.v4)();

    var eventPayload = command.payload;
    eventPayload.id = newStoryId;
    eventPayload.estimations = {};
    eventPayload.createdAt = new Date().getTime();
    room.applyEvent('storyAdded', eventPayload);

    if (!room.get('stories') || !room.get('stories').first()) {
      // this is the first story that gets added
      room.applyEvent('storySelected', { storyId: newStoryId });
    }
  }
};

exports.default = addStoryCommandHandler;