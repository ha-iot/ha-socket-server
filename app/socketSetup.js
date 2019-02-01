const socketLib = require('socket.io')
const clientListenerSetup = require('./client/listeners')
const boardListenerSetup = require('./board/listeners')

module.exports = server => {
  const io = socketLib(server)

  io.on('connection', socket => {
    const params = [io, socket, server.globalState]
    const {type} = socket.handshake.query
    if (type === 'hardwareHandler') {
      boardListenerSetup(...params)
    } else {
      clientListenerSetup(...params)
    }
  })
}
