const {END_USER_ROOM, HARDWARE_ACTIONS} = require('../constants')

module.exports = (io, socket, state) => {
  state.hardwareHandler = socket
  socket.emit('hardware/getData')

  socket.on('hardware/data',
    /**
     * @param {{lampsState, hardwareActions}} data
     */
    (data) => {
      data.hardwareActions.forEach(action => {
        HARDWARE_ACTIONS.add(action)
      })
      emitLampsToClient(data.lampsState)
    }
  )

  socket.on('hardware/lampsState', lamps => {
    emitLampsToClient(lamps)
  })

  socket.on('disconnect', () => {
    HARDWARE_ACTIONS.clear()
    state.hardwareHandler = null
    emitLampsToClient([])
  })

  function emitLampsToClient (lamps) {
    io.to(END_USER_ROOM).emit('client/lampsState', state.lamps = lamps)
  }
}
