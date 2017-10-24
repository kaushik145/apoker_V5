'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A user changes the title and/or description of a story
 */
var changeStoryCommandHandler = {
  existingRoom: true,
  preCondition: function preCondition(room, command, userId) {
    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot change stories!');
    }

    if (!room.getIn(['stories', command.payload.storyId])) {
      throw new Error('Cannot change unknown story ' + command.payload.storyId);
    }
  },
  fn: function fn(room, command) {
    room.applyEvent('storyChanged', command.payload);
  }
};

exports.default = changeStoryCommandHandler;