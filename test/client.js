const socketLib = require('socket.io-client')
const getServer = require('./server')

describe('Client', () => {
  const _getSocketClient = () => socketLib.connect(`http://localhost:${server.port}/`)
  const _defineHardwareSocket = ({lampsState, hardwareActions}, callback) => {
    const socketHardware = _getSocketClient()
    socketHardware.emit('general/specifyClient', {type: 'hardwareHandler'})
    socketHardware.on('hardware/getData', () => {
      socketHardware.emit('hardware/data', {
        hardwareActions: hardwareActions || ['toggle'],
        lampsState: lampsState || []
      })
      callback(socketHardware)
    })
  }
  let socketClient
  let server

  beforeEach(() => {
    server = getServer()
    socketClient = _getSocketClient()
  })

  afterEach(() => {
    socketClient.disconnect()
    server.close()
  })

  it('should specify itself and receive lamps with no hardware connected', done => {
    socketClient.emit('general/specifyClient')
    socketClient.emit('client/getLampsState')
    socketClient.on('client/lampsState', lamps => {
      lamps.should.be.deepEqual([])
      done()
    })
  })

  it('should specify itself and receive lamps from hardware', done => {
    const lampsState = [{isOn: true, label: 'Test 1'}]
    _defineHardwareSocket({lampsState}, (hardwareSocket) => {
      socketClient.emit('general/specifyClient')
      socketClient.emit('client/getLampsState')
      socketClient.on('client/lampsState', lamps => {
        lamps.should.be.deepEqual(lampsState)
        hardwareSocket.disconnect()
        done()
      })
    })
  })

  it('should be able to perform an action on lamps', done => {
    const lampsState = [{isOn: true, label: 'Test 1', number: 1}]
    _defineHardwareSocket({lampsState}, hardwareSocket => {
      let firstLampState = true
      socketClient.on('client/lampsState', lamps => {
        if (firstLampState) { // The lamp state when the client asks
          lamps.should.be.deepEqual(lampsState)
          firstLampState = false
          const actionObject = {action: 'toggle', target: 1}
          hardwareSocket.on('hardware/action', data => {
            data.should.be.deepEqual(actionObject)
            const newLamps = lampsState.map(lamp => Object.assign({}, lamp, {isOn: !lamp.isOn}))
            hardwareSocket.emit('hardware/lampsState', newLamps)
          })
          socketClient.emit('client/lampsAction', actionObject)
        } else { // The lamp state when the client performs a lamp action
          lampsState[0].isOn = false
          lamps.should.be.deepEqual(lampsState)
          hardwareSocket.disconnect()
          done()
        }
      })

      socketClient.emit('general/specifyClient')
      socketClient.emit('client/getLampsState')
    })
  })

  it('should receive a message if sent invalid data', done => {
    _defineHardwareSocket({}, hardwareSocket => {
      socketClient.on('client/response', data => {
        data.message.should.be.equal('You sent invalid data.')
        hardwareSocket.disconnect()
        done()
      })

      socketClient.emit('general/specifyClient')
      socketClient.emit('client/lampsAction', {action: 'randomAction'}) // And no target
    })
  })

  it('should receive a message if no handler connected', done => {
    socketClient.on('client/response', data => {
      data.message.should.be.equal('No handler connected.')
      done()
    })
    socketClient.emit('general/specifyClient')
    socketClient.emit('client/lampsAction')
  })
})
