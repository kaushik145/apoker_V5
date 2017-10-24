'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A user manually reveals estimates for a certain story
 * Users may only reveal the currently selected story
 * A user that is marked as visitor cannot reveal stories
 */
var revealCommandHandler = {
  existingRoom: true,
  preCondition: function preCondition(room, command, userId) {
    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only reveal currently selected story!');
    }

    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot reveal stories!');
    }
  },
  fn: function fn(room, command) {

    if (room.getIn(['stories', command.payload.storyId, 'revealed'])) {
      return;
    }

    room.applyEvent('revealed', {
      storyId: command.payload.storyId,
      manually: true
    });
  }
};

exports.default = revealCommandHandler;