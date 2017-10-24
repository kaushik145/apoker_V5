'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A user sets his username.
 */
var setUsernameCommandHandler = {
  existingRoom: true,
  preCondition: function preCondition(room, command, userId) {
    if (userId !== command.payload.userId) {
      throw new Error('Can only set username for own user!');
    }
  },
  fn: function fn(room, command) {
    room.applyEvent('usernameSet', command.payload);
  }
};

exports.default = setUsernameCommandHandler;