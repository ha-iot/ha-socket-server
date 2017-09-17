require('dotenv').config({silent: true})

const server = require('http').Server(require('express')())
const io = require('socket.io')(server)

server.listen(+process.env.PORT || 3000)

let arduinoHandler = null
const endUserRoom = 'endUsers'
let lamps = []

io.on('connection', socket => {
  socket.on('updateLamps', _lamps => { // Receive from Arduino handler
    io.to(endUserRoom).emit('lampsState', lamps = _lamps)
  })

  socket.on('specifyClient', data => {
    if (data && data.type === 'arduinoHandler') {
      arduinoHandler = socket
      socket.emit('getLampsState')
    } else {
      socket.join(endUserRoom)
    }
  })

  socket.on('getLampsState', () => {
    socket.emit('lampsState', lamps)
  })

  socket.on('arduinoAction',
    /**
     * {target: 'all', action: 'toggle'}
     * {target: 2, action: 'close'}
     * {target: 0, action: 'open'}
     * @param {{target, action}} data
     */
    (data) => {
      if (!arduinoHandler) {
        socket.emit('response', {message: 'No handler connected.'})
        return
      }
      if (socket === arduinoHandler) {
        socket.emit('response', {message: 'You can\'t send an action to yourself.'})
        return
      }

      if (data.target && data.action in ['toggle', 'open', 'close']) {
        arduinoHandler.emit('action', data)
      } else {
        socket.emit('response', {message: 'You sent invalid data.'})
      }
    }
  )

  socket.on('disconnect', () => {
    if (arduinoHandler === socket) {
      arduinoHandler = null
      io.to(endUserRoom).emit('updateLamps', lamps = [])
    } else if (endUserRoom in socket.rooms) {
      socket.leave(endUserRoom)
    }
  })
})
