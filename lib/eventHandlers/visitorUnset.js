'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var visitorUnsetEventHandler = function visitorUnsetEventHandler(room, eventPayload) {
  return room.updateIn(['users', eventPayload.userId], function (user) {
    return user.set('visitor', false);
  });
};

exports.default = visitorUnsetEventHandler;