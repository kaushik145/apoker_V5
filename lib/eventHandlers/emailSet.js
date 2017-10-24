'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var emailSetEventHandler = function emailSetEventHandler(room, eventPayload) {
  return room.updateIn(['users', eventPayload.userId], function (user) {
    return user.set('email', eventPayload.email);
  });
};

exports.default = emailSetEventHandler;