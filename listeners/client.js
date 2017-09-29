const {END_USER_ROOM, HARDWARE_ACTIONS} = require('../constants')

module.exports = (socket, state) => {
  socket.join(END_USER_ROOM)

  socket.on('client/getLampsState', () => {
    socket.emit('client/lampsState', state.lamps)
  })

  socket.on('client/lampsAction',
    /**
     * {target: 'all', action: 'toggle'}
     * {target: 2, action: 'close'}
     * {target: 0, action: 'open'}
     * @param {{target, action}} data
     */
    (data) => {
      if (!state.arduinoHandler) {
        socket.emit('client/response', {message: 'No handler connected.'})
        return
      }

      if (data.target && data.action in HARDWARE_ACTIONS) {
        state.arduinoHandler.emit('hardware/action', data)
      } else {
        socket.emit('client/response', {message: 'You sent invalid data.'})
      }
    }
  )

  socket.on('disconnect', () => {
    socket.leave(END_USER_ROOM)
  })
}
