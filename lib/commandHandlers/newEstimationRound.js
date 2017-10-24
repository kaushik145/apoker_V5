'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A user starts a new estimation round for a certain story.
 * (this will clear all estimations given by users for this story).
 *
 * Can only be done for the currently selected story.
 */
var newEstimationRoundCommandHandler = {
  existingRoom: true,
  preCondition: function preCondition(room, command, userId) {
    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only start a new round for currently selected story!');
    }

    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot start new estimation round!');
    }
  },
  fn: function fn(room, command) {
    room.applyEvent('newEstimationRoundStarted', command.payload);
  }
};

exports.default = newEstimationRoundCommandHandler;