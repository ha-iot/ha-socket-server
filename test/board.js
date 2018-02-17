const socketLib = require('socket.io-client')

describe('Board', () => {
  let server
  let socketClient
  const _getSocketClient = () => socketLib.connect(`http://localhost:${server.port}/`)

  before(() => {
    server = require('./server')()
  })

  beforeEach(() => {
    socketClient = _getSocketClient()
  })

  afterEach(() => {
    socketClient.close()
  })

  after(() => {
    server.close()
  })

  it('should specify itself and be asked to send hardware data', done => {
    socketClient.on('hardware/getData', () => {
      socketClient.emit('hardware/data', {
        hardwareActions: ['on', 'off'],
        lampsState: [{isOn: true, label: 'test 1'}]
      })
      done()
    })
    socketClient.emit('general/specifyClient', {type: 'hardwareHandler'})
  })

  it('should be able to send lamps state', done => {
    socketClient.emit('general/specifyClient', {type: 'hardwareHandler'})
    socketClient.on('hardware/getData', () => { // This event means the hardware is all set in the server
      socketClient.emit('hardware/lampsState', [
        {isOn: true, label: 'Test 1'},
        {isOn: true, label: 'Test 2'},
        {isOn: false, label: 'Test 3'},
        {isOn: true, label: 'Test 4'}
      ])
      done()
    })
  })
})
