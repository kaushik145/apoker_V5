'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _socketServer = require('./socketServer');

var _socketServer2 = _interopRequireDefault(_socketServer);

var _commandProcessor = require('./commandProcessor');

var _commandProcessor2 = _interopRequireDefault(_commandProcessor);

var _logging = require('./logging');

var _logging2 = _interopRequireDefault(_logging);

var _rest = require('./rest');

var _rest2 = _interopRequireDefault(_rest);

var _roomStoreFactory = require('./store/roomStoreFactory');

var _roomStoreFactory2 = _interopRequireDefault(_roomStoreFactory);

var _commandHandlers = require('./commandHandlers/commandHandlers');

var _commandHandlers2 = _interopRequireDefault(_commandHandlers);

var _eventHandlers = require('./eventHandlers/eventHandlers');

var _eventHandlers2 = _interopRequireDefault(_eventHandlers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOGGER = _logging2.default.getLogger('server');

var app = (0, _express2.default)();

var store = (0, _roomStoreFactory2.default)(_settings2.default.persistentStore);

// setup REST api
_rest2.default.init(app, store);

// serve static client files
app.use(_express2.default.static(_path2.default.resolve(__dirname, '../public')));
// enable html5 history mode by "forwarding" every unmatched route to the index.html file
app.get('*', function (request, response) {
  response.sendFile(_path2.default.resolve(__dirname, '../public/index.html'));
});

var commandProcessor = (0, _commandProcessor2.default)(_commandHandlers2.default, _eventHandlers2.default, store);

var server = _socketServer2.default.init(app, commandProcessor);
server.listen(_settings2.default.serverPort, _settings2.default.serverHost, function () {
  return LOGGER.info('-- SERVER STARTED -- (' + _settings2.default.serverHost + ':' + _settings2.default.serverPort + ')');
});

process.on('SIGINT', function () {
  return server.close(function () {
    return process.exit(0);
  });
});