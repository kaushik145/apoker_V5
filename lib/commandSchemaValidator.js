'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _tv = require('tv4');

var _tv2 = _interopRequireDefault(_tv);

var _logging = require('./logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOGGER = _logging2.default.getLogger('commandSchemaValidator');

var schemas = gatherSchemas();

registerCustomFormats();

exports.default = validate;

/**
 * Validates the given command against its schema.
 * for every command (command.name) there must be a json schema with a matching file name.
 *
 * (see http://json-schema.org/, https://www.npmjs.com/package/tv4)
 **/

function validate(cmd) {
  if (!cmd.name) {
    // without a name we can't even load the right schema
    throw new CommandValidationError(new Error('Command must contain a name!'), cmd);
  }

  var schema = schemas[cmd.name];

  if (!schema) {
    throw new CommandValidationError(new Error('Cannot validate command, no matching schema found for "' + cmd.name + '"!'), cmd);
  }

  var result = _tv2.default.validateMultiple(cmd, schema);
  if (!result.valid) {
    throw new CommandValidationError(new Error('Command validation failed!\n' + serializeErrors(result.errors)), cmd);
  }
}

function serializeErrors(tv4Errors) {
  var errs = tv4Errors.map(function (tv4Err) {
    return tv4Err.message + ' in ' + tv4Err.dataPath;
  });
  return errs.join('\n');
}

/**
 * loads all json schemas
 */
function gatherSchemas() {
  LOGGER.info('loading command schemas..');

  var schemaMap = {};
  var schemaFiles = _glob2.default.sync(_path2.default.resolve(__dirname, '../resources/validationSchemas/**/*.json'));

  LOGGER.info('got ' + schemaFiles.length + ' schema files...');

  schemaFiles.map(function (schemaFile) {
    var schemaFileContent = _fs2.default.readFileSync(schemaFile, 'utf-8');
    var schemaName = _path2.default.basename(schemaFile, '.json');
    schemaMap[schemaName] = parseSchemaFile(schemaFileContent, schemaFile);
  });

  // add the default command schema, which is referenced from all others ($ref)
  _tv2.default.addSchema(schemaMap.command);

  return schemaMap;
}

function parseSchemaFile(schemaFileContent, schemaFileName) {
  try {
    return JSON.parse(schemaFileContent);
  } catch (err) {
    LOGGER.error('Could not parse schema file ' + schemaFileName + '.', err);
  }
}

var EMAIL_REGEX = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
function registerCustomFormats() {
  _tv2.default.addFormat('email', validateEmail);
}

function validateEmail(data) {
  if (!data) {
    // allow empty string, undefined, null
    return;
  }

  if (typeof data === 'string' && EMAIL_REGEX.test(data)) {
    return null;
  }

  return 'must be a valid email-address';
}

function CommandValidationError(err, cmd) {
  this.stack = err.stack;
  this.name = this.constructor.name;
  this.message = 'Command validation Error during "' + cmd.name + '": ' + err.message;
}
_util2.default.inherits(CommandValidationError, Error);