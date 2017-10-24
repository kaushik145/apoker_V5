'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A user deletes a story
 */
var deleteStoryCommandHandler = {
  existingRoom: true,
  preCondition: function preCondition(room, command, userId) {
    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot delete stories!');
    }

    if (!room.getIn(['stories', command.payload.storyId])) {
      throw new Error('Cannot delete unknown story ' + command.payload.storyId);
    }
  },
  fn: function fn(room, command) {
    room.applyEvent('storyDeleted', command.payload);
  }
};

exports.default = deleteStoryCommandHandler;