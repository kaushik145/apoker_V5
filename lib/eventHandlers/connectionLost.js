'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var connectionLostEventHandler = function connectionLostEventHandler(room, eventPayload) {
  var matchingUser = room.getIn(['users', eventPayload.userId]);
  if (matchingUser) {
    return room.updateIn(['users', eventPayload.userId], function (user) {
      return user.set('disconnected', true);
    });
  } else {
    return room;
  }
};

exports.default = connectionLostEventHandler;