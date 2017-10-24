'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getNewRoomsStore;

var _roomsStore = require('./roomsStore');

var _roomsStore2 = _interopRequireDefault(_roomsStore);

var _inMemoryRoomsStore = require('./inMemoryRoomsStore');

var _inMemoryRoomsStore2 = _interopRequireDefault(_inMemoryRoomsStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * will return either a persistent or in-memory rooms store
 * @param {boolean} persistent
 * @returns {{init, getRoomById, saveRoom, getAllRooms}}
 */
function getNewRoomsStore(persistent) {
  var store = persistent ? _roomsStore2.default : _inMemoryRoomsStore2.default;
  store.init();
  return store;
}