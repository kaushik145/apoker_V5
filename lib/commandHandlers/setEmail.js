'use strict';

/**
 * A user sets his email address (used for Gravatar image fetching. See https://en.gravatar.com/ ).
 */
module.exports = {
  existingRoom: true,
  preCondition: function preCondition(room, command, userId) {
    if (userId !== command.payload.userId) {
      throw new Error('Can only set email for own user!');
    }
  },
  fn: function fn(room, command) {
    room.applyEvent('emailSet', command.payload);
  }
};