require('dotenv').config({silent: true})
const path = require('path')

const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen(+process.env.PORT || 3000)

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
  socket.on('response', ({message}) => {
    console.log(message)
    process.exit()
  })
  socket.emit('toggle', {target: process.argv[2]})
})
