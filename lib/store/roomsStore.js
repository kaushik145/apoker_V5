'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _settings = require('../settings');

var _settings2 = _interopRequireDefault(_settings);

var _logging = require('../logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// "promisify" redis client with bluebird -> use client.getAsync / client.setAsync / etc.
_bluebird2.default.promisifyAll(_redis2.default.RedisClient.prototype);

var LOGGER = _logging2.default.getLogger('roomsStore');

var POINZ_REDIS_KEY_PREFIX = 'poinz:';

var redisClient;

exports.default = {
  init: init,
  getRoomById: getRoomById,
  saveRoom: saveRoom,
  getAllRooms: getAllRooms
};

/**
 * do not connect to redis right away, let server invoke init
 * (since this roomsStore might be imported, but not actually used)
 */

function init() {
  // redisClient = redis.createClient(settings.redis);
  redisClient = _redis2.default.createClient(process.env.REDIS_URL);

  redisClient.on('error', LOGGER.error);
  redisClient.select(0, function (err, status) {
    return LOGGER.info('select redis 0 ' + err + ' ' + status);
  });
}

/**
 * returns the room with the given id or undefined if the store does not contain such a room.
 *
 * @param {string} roomId
 * @returns {Promise.<Immutable.Map>}
 */
function getRoomById(roomId) {
  return getRoomByIdIntern(POINZ_REDIS_KEY_PREFIX + roomId);
}

/**
 * pass in the already prependend ("poinz:") roomId
 */
function getRoomByIdIntern(roomIdPrepended) {
  return redisClient.getAsync(roomIdPrepended).then(function (res) {
    return res ? redisValueToImmutableRoom(res) : undefined;
  });
}

function redisValueToImmutableRoom(redisValue) {
  try {
    var parsedValue = JSON.parse(redisValue);
    return _immutable2.default.fromJS(parsedValue);
  } catch (err) {
    throw new Error('Invalid data in store ' + redisValue + '\n' + err.message);
  }
}

/**
 * stores the given room object
 * @param {Immutable.Map} room
 * @returns {Promise<T>}
 */
function saveRoom(room) {
  return redisClient.setAsync(POINZ_REDIS_KEY_PREFIX + room.get('id'), JSON.stringify(room.toJS()));
}

/**
 * returns all rooms in the store.
 * (use with care!)
 *
 * @returns {Promise.<Immutable.List>}
 */
function getAllRooms() {
  return getAllKeysInCollection().then(function (allKeys) {
    return _bluebird2.default.all(allKeys.map(function (key) {
      return getRoomByIdIntern(key);
    }));
  }).then(function (allRooms) {
    return new _immutable2.default.List(allRooms);
  });
}

function getAllKeysInCollection() {

  var cursor = '0';
  var allKeys = [];

  return new _bluebird2.default(doScan);

  function doScan(resolve, reject) {
    redisClient.scan(cursor, 'MATCH', POINZ_REDIS_KEY_PREFIX + '*', 'COUNT', '10', function (err, res) {
      if (err) {
        reject(err);
        return;
      }

      // Update the cursor position for the next scan
      cursor = res[0];
      // get the SCAN result for this iteration
      var keys = res[1];

      if (keys.length > 0) {
        allKeys = allKeys.concat(keys);
      }

      if (cursor === '0') {
        resolve(allKeys);
        return;
      }

      return doScan(resolve, reject);
    });
  }
}