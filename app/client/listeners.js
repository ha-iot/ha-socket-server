const {END_USER_ROOM, HARDWARE_ACTIONS} = require('../constants')

module.exports = (io, socket, state) => {
  socket.join(END_USER_ROOM)
  _emitClientsLogged()

  socket.on('client/getLampsState', () => {
    socket.emit('client/lampsState', state.lamps)
  })

  socket.on('client/lampsAction', _lampsAction)

  socket.on('disconnect', () => {
    socket.leave(END_USER_ROOM)
    _emitClientsLogged()
  })

  /**
   * @param {{target, action}} data
   */
  function _lampsAction (data) {
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

  function _emitClientsLogged () {
    io.of('/').in(END_USER_ROOM).clients((_, clients) => {
      io.to(END_USER_ROOM).emit('client/clientsConnected', {data: clients.length})
    })
  }
}
