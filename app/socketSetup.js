const socketLib = require('socket.io')
const clientListenerSetup = require('./client/listeners')
const boardListenerSetup = require('./board/listeners')

module.exports = server => {
  const io = socketLib(server)

  io.on('connection', socket => {
    socket.on('general/specifyClient', data => {
      const params = [io, socket, server.globalState]
      if (data && data.type === 'hardwareHandler') {
        boardListenerSetup(...params)
      } else {
        clientListenerSetup(...params)
      }
    })
  })
}
