const {END_USER_ROOM, HARDWARE_ACTIONS} = require('../constants')

module.exports = (io, socket, state) => {
  socket.join(END_USER_ROOM)
  _emitClientsLogged(io)

  socket.on('client/getLampsState', _emitLampsState.bind({state, socket}))
  socket.on('client/lampsAction', _lampsAction.bind({state, socket}))
  socket.on('disconnect', _disconnect.bind({io, socket}))
}

function _disconnect () {
  const {socket, io} = this
  socket.leave(END_USER_ROOM)
  _emitClientsLogged(io)
}

function _emitClientsLogged (io) {
  io.of('/').in(END_USER_ROOM).clients((_, clients) => {
    io.to(END_USER_ROOM).emit('client/clientsConnected', {data: clients.length})
  })
}

/**
 * Usage: pass with "bind", _lampsAction.bind({socket: <Socket instance>, state: <State object>})
 * @param {{target, action}} data
 * @private
 */
function _lampsAction (data) {
  const {state, socket} = this

  if (!state.hardwareHandler) {
    socket.emit('client/response', {message: 'No handler connected.'})
    return
  }

  if (data.target && HARDWARE_ACTIONS.has(data.action)) {
    state.hardwareHandler.emit('hardware/action', data)
  } else {
    socket.emit('client/response', {message: 'You sent invalid data.'})
  }
}

/**
 * Usage: pass with "bind", _emitLampsState.bind({socket: <Socket instance>})
 * @private
 */
function _emitLampsState () {
  const {socket, state} = this
  socket.emit('client/lampsState', state.lamps)
}
