'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A user removes a disconnected user from the room.
 *
 */
var kickCommandHandler = {
  existingRoom: true,
  preCondition: function preCondition(room, command, userId) {

    if (userId === command.payload.userId) {
      throw new Error('User cannot kick himself!');
    }

    if (!room.getIn(['users', command.payload.userId])) {
      throw new Error('Can only kick user that belongs to the same room!');
    }

    if (!room.getIn(['users', command.payload.userId, 'disconnected'])) {
      throw new Error('Can only kick disconnected users!');
    }

    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot kick other users!');
    }
  },
  fn: function fn(room, command) {
    room.applyEvent('kicked', { userId: command.payload.userId });
  }
};

exports.default = kickCommandHandler;