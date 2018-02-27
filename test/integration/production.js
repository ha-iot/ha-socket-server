const http = require('http')
const path = require('path')

const indexPath = path.resolve(path.dirname(path.dirname(__dirname)), 'index.js')

describe('Production server', () => {
  it('must start in the default port', done => {
    process.env.PORT = undefined
    const PORT = 3003
    const server = require(indexPath)
    delete require.cache[indexPath]

    const _oldLog = console.log
    console.log = () => undefined

    http.get(`http://localhost:${PORT}`, response => {
      response.statusCode.should.be.equal(404)

      server.close()
      console.log = _oldLog
      done()
    })
  })

  it('must start in a custom port', done => {
    const PORT = 9834
    process.env.PORT = PORT.toString()
    const server = require(indexPath)
    delete require.cache[indexPath]

    const _oldLog = console.log
    console.log = () => undefined

    http.get(`http://localhost:${PORT}`, response => {
      response.statusCode.should.be.equal(404)

      server.close()
      console.log = _oldLog
      done()
    })
  })
})
