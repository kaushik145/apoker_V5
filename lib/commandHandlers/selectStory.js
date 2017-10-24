'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A user selected a story (marked it as the "current" story to estimate)
 */
var selectStoryCommandHandler = {
  existingRoom: true,
  preCondition: function preCondition(room, command, userId) {
    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot select current story!');
    }

    // check that id in payload is one of the stories in room
    if (!room.getIn(['stories', command.payload.storyId])) {
      throw new Error('Story ' + command.payload.storyId + ' cannot be selected. It is not part of room ' + room.get('id'));
    }
  },
  fn: function fn(room, command) {
    room.applyEvent('storySelected', { storyId: command.payload.storyId });
  }
};

exports.default = selectStoryCommandHandler;