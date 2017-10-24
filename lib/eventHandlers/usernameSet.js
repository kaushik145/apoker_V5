'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var usernameSetEventHandler = function usernameSetEventHandler(room, eventPayload) {
  return room.updateIn(['users', eventPayload.userId], function (user) {
    return user.set('username', eventPayload.username);
  });
};

exports.default = usernameSetEventHandler;