require('dotenv').config({silent: true})

const clientListenerSetup = require('./listeners/client')
const hardwareListenerSetup = require('./listeners/hardware')

const server = require('http').Server(require('express')())
const io = require('socket.io')(server)

server.listen(+process.env.PORT || 3000)

let state = {
  lamps: [],
  arduinoHandler: null
}

io.on('connection', socket => {
  socket.on('general/specifyClient', data => {
    if (data && data.type === 'hardwareHandler') {
      hardwareListenerSetup(io, socket, state)
    } else {
      clientListenerSetup(socket, state)
    }
  })
})
