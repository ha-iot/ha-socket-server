const sinon = require('sinon')
const assert = require('assert')
const proxyquire = require('proxyquire')

describe('Socket server setup', () => {
  let io
  let socket

  beforeEach(() => {
    io = {
      on: sinon.spy()
    }
    socket = {
      on: sinon.spy()
    }
  })

  it('should set "connection" listener', done => {
    const setup = proxyquire('../app/socketSetup', {
      'socket.io': sinon.stub().returns(io)
    })

    const serverInstance = {}
    setup(serverInstance)

    assert(io.on.calledOnce)
    assert(io.on.calledWithExactly('connection', sinon.match.func))

    done()
  })

  it('should set "general/specifyClient" listener when "connection" is triggered', done => {
    const setup = proxyquire('../app/socketSetup', {
      'socket.io': sinon.stub().returns(io)
    })

    io.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'connection') {
        handler(socket)
      }
    })

    const serverInstance = {}
    setup(serverInstance)

    assert(socket.on.calledOnce)
    assert(socket.on.calledWithExactly('general/specifyClient', sinon.match.func))

    done()
  })

  it('should setup the board listeners when "general/specifyClient" is triggered with type as "hardwareHandler"', done => {
    const boardListenerSpy = sinon.spy()

    const setup = proxyquire('../app/socketSetup', {
      'socket.io': sinon.stub().returns(io),
      './board/listeners': boardListenerSpy
    })

    io.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'connection') {
        handler(socket)
      }
    })

    socket.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'general/specifyClient') {
        const data = {type: 'hardwareHandler'}
        handler(data)
      }
    })

    const serverInstance = {
      globalState: {}
    }
    setup(serverInstance)

    assert(boardListenerSpy.calledOnce)
    assert(boardListenerSpy.calledWithExactly(io, socket, serverInstance.globalState))

    done()
  })

  it('should setup the client listeners when "general/specifyClient" is triggered with type as undefined', done => {
    const clientListenerSpy = sinon.spy()

    const setup = proxyquire('../app/socketSetup', {
      'socket.io': sinon.stub().returns(io),
      './client/listeners': clientListenerSpy
    })

    io.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'connection') {
        handler(socket)
      }
    })

    socket.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'general/specifyClient') {
        const data = {type: undefined}
        // const data = {} // This would work too
        handler(data)
      }
    })

    const serverInstance = {
      globalState: {}
    }
    setup(serverInstance)

    assert(clientListenerSpy.calledOnce)
    assert(clientListenerSpy.calledWithExactly(io, socket, serverInstance.globalState))

    done()
  })
})
