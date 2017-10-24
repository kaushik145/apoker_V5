'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _winstonDailyRotateFile = require('winston-daily-rotate-file');

var _winstonDailyRotateFile2 = _interopRequireDefault(_winstonDailyRotateFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * configuration of root logger with two appenders.
 * see settings.js for loglevel and filename
 */
_winston2.default.loggers.options.transports = [new _winston2.default.transports.Console({
  level: _settings2.default.log.console.level,
  showLevel: false,
  timestamp: true
}), new _winstonDailyRotateFile2.default({
  filename: _settings2.default.log.file.name,
  level: _settings2.default.log.file.level,
  json: false,
  timestamp: true
})];

/**
 * Returns a new Logger for your component
 *
 * @param {string} loggerName
 * @returns {object} the new Logger
 */
function getLogger(loggerName) {
  var newLogger = _winston2.default.loggers.add(loggerName);
  newLogger.filters.push(function (level, msg, meta) {
    return {
      msg: '[' + level + '] ' + loggerName + ': ' + msg,
      meta: meta
    };
  });

  return newLogger;
}

exports.default = { getLogger: getLogger };