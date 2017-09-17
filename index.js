require('dotenv').config({silent: true})

const server = require('http').Server(require('express')())
const io = require('socket.io')(server)

server.listen(+process.env.PORT || 3000)

io.on('connection', socket => {
  socket.on('response', ({message}) => {
    console.log(message)
    process.exit()
  })
  socket.emit('toggle', {target: process.argv[2]})
})
