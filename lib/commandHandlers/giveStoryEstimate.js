'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A user gives his estimation for a certain story.
 * Users may only give estimations for the currently selected story.
 * A user that is marked as visitor cannot give estimations
 * As soon as all users (that can estimate) estimated the story, a "revealed" event is produced
 */
var giveStoryEstimateCommandHandler = {
  existingRoom: true,
  preCondition: function preCondition(room, command, userId) {
    if (command.payload.userId !== userId) {
      throw new Error('Can only give estimate if userId in command payload matches!');
    }

    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only give estimation for currently selected story!');
    }

    if (room.getIn(['stories', command.payload.storyId, 'revealed'])) {
      throw new Error('You cannot give an estimate for a story that was revealed!');
    }

    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot give estimations!');
    }
  },
  fn: function fn(room, command) {
    // currently estimation value is also sent to clients (hidden there)
    // user could "sniff" network traffic and see estimations of colleagues...
    // this could be improved in the future.. (e.g. not send value with "storyEstimateGiven" -> but send all values later with "revealed" )
    room.applyEvent('storyEstimateGiven', command.payload);

    if (allValidUsersEstimated(room, command)) {

      room.applyEvent('revealed', {
        storyId: command.payload.storyId,
        manually: false
      });
    }
  }
};

/**
 * checks if every user in the room (that is not marked as visitor and is not disconnected)  did estimate the current story
 * @param room
 * @param command
 * @returns {boolean}
 */
function allValidUsersEstimated(room, command) {
  var userIdsThatHaveEstimateGiven = room.getIn(['stories', command.payload.storyId, 'estimations']).keySeq().toJS();
  userIdsThatHaveEstimateGiven.push(command.payload.userId);
  var allUserIdsThatCanEstimate = room.get('users').filter(function (usr) {
    return !usr.get('visitor');
  }).filter(function (usr) {
    return !usr.get('disconnected');
  }).keySeq().toJS();

  return userIdsThatHaveEstimateGiven.length <= allUserIdsThatCanEstimate.length && _lodash2.default.isEqual(userIdsThatHaveEstimateGiven.sort(), allUserIdsThatCanEstimate.sort());
}

exports.default = giveStoryEstimateCommandHandler;