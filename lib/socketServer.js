'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _uuid = require('uuid');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _logging = require('./logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOGGER = _logging2.default.getLogger('socketServer');

var io = void 0,
    commandProcessor = void 0;

var socketToUserIdMap = {},
    socketToRoomMap = {};

exports.default = { init: init };


function init(app, cmdProcessor) {
  var server = _http2.default.createServer(app);
  io = (0, _socket2.default)(server);
  io.on('connect', handleNewConnection);
  commandProcessor = cmdProcessor;
  return server;
}

function handleNewConnection(socket) {
  socket.on('disconnect', onSocketDisconnect.bind(undefined, socket));
  socket.on('command', function (msg) {
    return handleIncomingCommand(socket, msg);
  });
}

function handleIncomingCommand(socket, msg) {
  LOGGER.debug('incoming command', msg);

  commandProcessor(msg, socketToUserIdMap[socket.id]).then(function (producedEvents) {
    if (msg.name === 'joinRoom') {
      // TODO: for this, we need to "know" a lot about the commandHandler for "joinRoom". How to improve that?
      registerUserWithSocket(msg, socket, producedEvents[producedEvents.length - 1].payload.userId);
    }

    sendEvents(producedEvents, msg.roomId);
  }).catch(function (commandProcessingError) {
    return handleCommandProcessingError(commandProcessingError, msg, socket);
  });
}

/**
 * send produced events to all sockets in room
 * @param producedEvents
 * @param roomId
 */
function sendEvents(producedEvents, roomId) {
  producedEvents.forEach(function (producedEvent) {
    io.to(roomId).emit('event', producedEvent);
    LOGGER.debug('outgoing event', producedEvent);
  });
}

/**
 * If command processing failed, we send a "commandRejected" event to the client that issued the command.
 * (not sent to all sockets in the room)
 *
 */
function handleCommandProcessingError(error, command, socket) {
  LOGGER.error(error.stack);
  var commandRejectedEvent = {
    name: 'commandRejected',
    id: (0, _uuid.v4)(),
    correlationId: command.id,
    roomId: command.roomId,
    payload: {
      command: command,
      reason: error.message
    }
  };

  LOGGER.debug('outgoing event', commandRejectedEvent);

  // command rejected event is only sent to the one socket that sent the command
  socket.emit('event', commandRejectedEvent);
}

/**
 * at this point, we know that the join was successful.
 * we need do keep the mapping of a socket to room and userId - so that we can produce "user left" events
 * on socket disconnect.
 *
 * @param {object} joinRoomCommand the handled joinRoom command
 * @param socket
 * @param userIdToStore
 */
function registerUserWithSocket(joinRoomCommand, socket, userIdToStore) {
  if (!userIdToStore) {
    throw new Error('No userId after "roomJoined" to pu into socketToUserIdMap!');
  }
  socketToRoomMap[socket.id] = joinRoomCommand.roomId;
  socketToUserIdMap[socket.id] = userIdToStore;

  // put socket into socket.io room with given id
  socket.join(joinRoomCommand.roomId, function () {
    return LOGGER.debug('socket with id ' + socket.id + ' joined room ' + joinRoomCommand.roomId);
  });
}

/**
 * if the socket is disconnected (e.g. user closed browser tab), manually produce and handle
 * a "leaveRoom" command that will mark the user.
 */
function onSocketDisconnect(socket) {

  var userId = socketToUserIdMap[socket.id];
  var roomId = socketToRoomMap[socket.id]; // socket.rooms is at this moment already emptied. so we have to use our own map

  if (!userId || !roomId) {
    // this can happen if the server was restarted, and a client re-connected!
    LOGGER.debug('could not send leaveRoom command for userId=' + userId + ' in roomId=' + roomId);
    return;
  }

  handleIncomingCommand(socket, {
    id: (0, _uuid.v4)(),
    roomId: roomId,
    name: 'leaveRoom',
    payload: {
      userId: userId,
      connectionLost: true // user did not send "leaveRoom" command manually. But connection was lost (e.g. browser closed)
    }
  });
}