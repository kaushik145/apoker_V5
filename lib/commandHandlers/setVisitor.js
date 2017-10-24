'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A user sets or unsets himself as visitor (payload contains flag).
 * Emits event only if visitor state changed
 *
 * Visitors cannot estimate stories.
 *
 */
var setVisitorCommandHandler = {
  existingRoom: true,
  preCondition: function preCondition(room, command, userId) {
    if (userId !== command.payload.userId) {
      throw new Error('Can only set visitor flag for own user!');
    }
  },
  fn: function fn(room, command) {
    if (command.payload.isVisitor) {
      room.applyEvent('visitorSet', { userId: command.payload.userId });
    } else {
      room.applyEvent('visitorUnset', { userId: command.payload.userId });
    }
  }
};

exports.default = setVisitorCommandHandler;