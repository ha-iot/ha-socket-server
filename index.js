require('dotenv').config({silent: true})

const server = require('http').Server(require('express')())
const io = require('socket.io')(server)

server.listen(+process.env.PORT || 3000)

const HARDWARE_ACTIONS = {toggle: true, on: true, off: true}
const END_USER_ROOM = 'endUsers'

let lamps = []
let arduinoHandler = null

io.on('connection', socket => {
  socket.on('hardware/lampsState', _lamps => {
    io.to(END_USER_ROOM).emit('client/lampsState', lamps = _lamps)
  })

  socket.on('general/specifyClient', data => {
    if (data && data.type === 'hardwareHandler') {
      arduinoHandler = socket
      socket.emit('hardware/getLampsState')
    } else {
      socket.join(END_USER_ROOM)
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

      if (data.target && data.action in HARDWARE_ACTIONS) {
        arduinoHandler.emit('hardware/action', data)
      } else {
        socket.emit('client/response', {message: 'You sent invalid data.'})
      }
    }
  )

  socket.on('disconnect', () => {
    if (arduinoHandler === socket) {
      arduinoHandler = null
      io.to(END_USER_ROOM).emit('client/lampsState', lamps = [])
    } else if (END_USER_ROOM in socket.rooms) {
      socket.leave(END_USER_ROOM)
    }
  })
})
