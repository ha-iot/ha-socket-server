require('dotenv').config({silent: true})

const server = require('http').Server(require('express')())
const io = require('socket.io')(server)

server.listen(+process.env.PORT || 3000)

let arduinoHandler = null
const endUserRoom = 'endUsers'
let lamps = []

io.on('connection', socket => {
  socket.on('hardware/lampsState', _lamps => {
    io.to(endUserRoom).emit('client/lampsState', lamps = _lamps)
  })

  socket.on('general/specifyClient', data => {
    if (data && data.type === 'hardwareHandler') {
      arduinoHandler = socket
      socket.emit('hardware/getLampsState')
    } else {
      socket.join(endUserRoom)
    }
  })

  socket.on('client/getLampsState', () => {
    socket.emit('client/lampsState', lamps)
  })

  socket.on('client/lampsAction',
    /**
     * {target: 'all', action: 'toggle'}
     * {target: 2, action: 'close'}
     * {target: 0, action: 'open'}
     * @param {{target, action}} data
     */
    (data) => {
      if (!arduinoHandler) {
        socket.emit('client/response', {message: 'No handler connected.'})
        return
      } else if (socket === arduinoHandler) {
        socket.emit('hardware/response', {message: 'You can\'t send an action to yourself.'})
        return
      }

      if (data.target && ['toggle', 'on', 'off'].indexOf(data.action) >= 0) {
        arduinoHandler.emit('hardware/action', data)
      } else {
        socket.emit('client/response', {message: 'You sent invalid data.'})
      }
    }
  )

  socket.on('disconnect', () => {
    if (arduinoHandler === socket) {
      arduinoHandler = null
      io.to(endUserRoom).emit('client/lampsState', lamps = [])
    } else if (endUserRoom in socket.rooms) {
      socket.leave(endUserRoom)
    }
  })
})
