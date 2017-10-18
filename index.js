require('dotenv').config({silent: true})

const server = require('http').Server(require('express')())
const PORT = +process.env.PORT || 3003

server.listen(PORT, () => {
  console.log(`Server up and running at port ${PORT}.`)
})

require('./listeners/mainConnection')(server)

module.exports = server
