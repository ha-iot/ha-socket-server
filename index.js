require('dotenv').config({silent: true})

const clientListenerSetup = require('./listeners/client')
const hardwareListenerSetup = require('./listeners/hardware')

const server = require('http').Server(require('express')())
const io = require('socket.io')(server)

const PORT = +process.env.PORT || 3003
server.listen(PORT, () => {
  console.log(`Server up and running at port ${PORT}.`)
})

let state = {
  lamps: [],
  hardwareHandler: null
}

io.on('connection', socket => {
  socket.on('general/specifyClient', data => {
    const params = [io, socket, state]
    if (data && data.type === 'hardwareHandler') {
      hardwareListenerSetup(...params)
    } else {
      clientListenerSetup(...params)
    }
  })
})
