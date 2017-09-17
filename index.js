require('dotenv').config({silent: true})

const server = require('http').Server(require('express')())
const io = require('socket.io')(server)

server.listen(+process.env.PORT || 3000)

let arduinoHandler = null
const endUserRoom = 'endUsers'

io.on('connection', socket => {
  socket.on('response', ({message}) => {
    console.log(message)
  })

  socket.on('specify client', data => {
    if (data.type === 'arduinoHandler') {
      socket.emit('response', {message: setArduinoHandler(socket)})
    } else {
      socket.join(endUserRoom)
    }
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
    } else if (endUserRoom in socket.rooms) {
      socket.leave(endUserRoom)
    }
  })
})

/**
 * Receives a socket connection, checks as the Arduino handler and returns a message
 * @param {Socket} socket
 * @returns {String} A message as string
 */
function setArduinoHandler (socket) {
  if (arduinoHandler) {
    return 'There is already an Arduino handler.'
  }

  arduinoHandler = socket
  return 'You are now the Arduino handler.'
}
