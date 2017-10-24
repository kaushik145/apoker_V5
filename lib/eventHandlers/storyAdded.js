'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storyAddedEventHandler = function storyAddedEventHandler(room, eventPayload) {

  var newStory = _immutable2.default.fromJS(Object.assign(eventPayload, {
    estimations: {}
  }));

  return room.update('stories', new _immutable2.default.Map(), function (stories) {
    return stories.set(eventPayload.id, newStory);
  });
};

exports.default = storyAddedEventHandler;