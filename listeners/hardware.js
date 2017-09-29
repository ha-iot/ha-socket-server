const {END_USER_ROOM} = require('../constants')

module.exports = (io, socket, state) => {
  state.arduinoHandler = socket
  socket.emit('hardware/getLampsState')

  socket.on('hardware/lampsState', _lamps => {
    emitLampsToClient(_lamps)
  })

  socket.on('disconnect', () => {
    state.arduinoHandler = null
    emitLampsToClient([])
  })

  function emitLampsToClient (lamps) {
    io.to(END_USER_ROOM).emit('client/lampsState', state.lamps = lamps)
  }
}
