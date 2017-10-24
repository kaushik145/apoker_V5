'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This module handles incoming requests to the REST api.
 * Currently there is only one endpoint: /api/status
 *
 * All other communication between client and server (story-, estimation- and user-related)
 * is done via websocket connection.
 *
 */

/**
 *
 * @param app the express app object
 * @param store the roomsStore object
 */
function init(app, store) {

  var restRouter = _express2.default.Router();
  restRouter.get('/status', function (req, res) {
    return buildStatusObject().then(function (status) {
      return res.json(status);
    });
  });
  app.use('/api', restRouter);

  function buildStatusObject() {
    return store.getAllRooms().then(function (allRooms) {
      var rooms = allRooms
      // the status page in the client is technically also a room. do not include it in the result.
      .filter(function (room) {
        return room && room.get('id') !== 'poinzstatus';
      }).map(function (room) {
        return new _immutable2.default.Map({
          userCount: room.get('users').size,
          userCountDisconnected: room.get('users').filter(function (user) {
            return user.get('disconnected');
          }).size,
          lastActivity: room.get('lastActivity'),
          created: room.get('created')
        });
      }).toList().toJS();

      return {
        rooms: rooms,
        roomCount: rooms.length,
        uptime: Math.floor(process.uptime())
      };
    });
  }
}

exports.default = { init: init };