const {END_USER_ROOM, HARDWARE_ACTIONS} = require('../constants')

module.exports = (io, socket, state) => {
  let _hardwareActions
  state.hardwareHandler = socket
  socket.emit('hardware/getData')

  socket.on('hardware/data',
    /**
     * @param {{lampsState, hardwareActions}} data
     */
    (data) => {
      _hardwareActions = data.hardwareActions
      _hardwareActions.forEach(action => {
        HARDWARE_ACTIONS[action] = true
      })
      emitLampsToClient(data.lampsState)
    }
  )

  socket.on('hardware/lampsState', lamps => {
    emitLampsToClient(lamps)
  })

  socket.on('disconnect', () => {
    _hardwareActions.forEach(action => {
      delete HARDWARE_ACTIONS[action]
    })
    state.hardwareHandler = null
    emitLampsToClient([])
  })

  function emitLampsToClient (lamps) {
    io.to(END_USER_ROOM).emit('client/lampsState', state.lamps = lamps)
  }
}
