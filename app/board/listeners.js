const {END_USER_ROOM, HARDWARE_ACTIONS} = require('../constants')

module.exports = (io, socket, state) => {
  state.hardwareHandler = socket
  socket.emit('hardware/getData')

  const _this = {io, state}

  socket.on('hardware/data', _receiveBoardData.bind(_this))
  socket.on('hardware/lampsState', _receiveBoardLampsState.bind(_this))
  socket.on('disconnect', _disconnect.bind(_this))
}

function _disconnect() {
  const {io, state} = this
  HARDWARE_ACTIONS.clear()
  state.hardwareHandler = null
  io.to(END_USER_ROOM).emit('client/lampsState', state.lamps = [])
}

/**
 * @param {{lampsState, hardwareActions}} data
 */
function _receiveBoardData(data) {
  const {io, state} = this
  data.hardwareActions.forEach(action => {
    HARDWARE_ACTIONS.add(action)
  })
  io.to(END_USER_ROOM).emit('client/lampsState', state.lamps = data.lampsState)
}

function _receiveBoardLampsState(lamps) {
  const {io, state} = this
  io.to(END_USER_ROOM).emit('client/lampsState', state.lamps = lamps)
}
