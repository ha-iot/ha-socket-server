require('dotenv').config({silent: true})

const TEST = process.argv.some(arg => /test/.test(arg))

if (!TEST) {
  // Hitting the database during tests was causing it to take forever (literally)
  require('./models')
}

const server = require('http').Server(require('express')())
const PORT = +process.env.PORT || 3003

server.listen(PORT, () => {
  console.log(`Server up and running at port ${PORT}.`)
})

server.globalState = {
  lamps: [],
  hardwareHandler: null
}

require('./app/socketSetup')(server)

module.exports = server
