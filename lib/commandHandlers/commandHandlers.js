'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _addStory = require('./addStory');

var _addStory2 = _interopRequireDefault(_addStory);

var _changeStory = require('./changeStory');

var _changeStory2 = _interopRequireDefault(_changeStory);

var _deleteStory = require('./deleteStory');

var _deleteStory2 = _interopRequireDefault(_deleteStory);

var _clearStoryEstimate = require('./clearStoryEstimate');

var _clearStoryEstimate2 = _interopRequireDefault(_clearStoryEstimate);

var _giveStoryEstimate = require('./giveStoryEstimate');

var _giveStoryEstimate2 = _interopRequireDefault(_giveStoryEstimate);

var _joinRoom = require('./joinRoom');

var _joinRoom2 = _interopRequireDefault(_joinRoom);

var _kick = require('./kick');

var _kick2 = _interopRequireDefault(_kick);

var _leaveRoom = require('./leaveRoom');

var _leaveRoom2 = _interopRequireDefault(_leaveRoom);

var _newEstimationRound = require('./newEstimationRound');

var _newEstimationRound2 = _interopRequireDefault(_newEstimationRound);

var _reveal = require('./reveal');

var _reveal2 = _interopRequireDefault(_reveal);

var _selectStory = require('./selectStory');

var _selectStory2 = _interopRequireDefault(_selectStory);

var _setUsername = require('./setUsername');

var _setUsername2 = _interopRequireDefault(_setUsername);

var _setEmail = require('./setEmail');

var _setEmail2 = _interopRequireDefault(_setEmail);

var _setVisitor = require('./setVisitor');

var _setVisitor2 = _interopRequireDefault(_setVisitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  addStory: _addStory2.default,
  changeStory: _changeStory2.default,
  deleteStory: _deleteStory2.default,
  clearStoryEstimate: _clearStoryEstimate2.default,
  giveStoryEstimate: _giveStoryEstimate2.default,
  joinRoom: _joinRoom2.default,
  kick: _kick2.default,
  leaveRoom: _leaveRoom2.default,
  newEstimationRound: _newEstimationRound2.default,
  reveal: _reveal2.default,
  selectStory: _selectStory2.default,
  setUsername: _setUsername2.default,
  setEmail: _setEmail2.default,
  setVisitor: _setVisitor2.default
};