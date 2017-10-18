const http = require('http')

module.exports = () => {
  const server = http.createServer()
  server.port = 8990
  server.setTimeout(150) // Was taking too long to end the process. Default is 120.000 (2 minutes)
  server.listen(server.port)
  require('../app/socketSetup')(server)
  return server
}
