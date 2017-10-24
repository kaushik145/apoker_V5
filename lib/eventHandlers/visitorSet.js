'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var visitorSetEventHandler = function visitorSetEventHandler(room, eventPayload) {
  return room.updateIn(['users', eventPayload.userId], function (user) {
    return user.set('visitor', true);
  });
};

exports.default = visitorSetEventHandler;