const sinon = require('sinon')
const assert = require('assert')
const proxyquire = require('proxyquire')

describe('Socket server setup', () => {
  let io
  let socket

  beforeEach(() => {
    io = {
      on: sinon.spy(),
    }
    socket = {
      on: sinon.spy(),
    }
  })

  it('should set "connection" listener', done => {
    const setup = proxyquire('../../app/socketSetup', {
      'socket.io': sinon.stub().returns(io),
    })

    const serverInstance = {}
    setup(serverInstance)

    assert(io.on.calledOnce)
    assert(io.on.calledWithExactly('connection', sinon.match.func))

    done()
  })

  it('should setup the board listeners when "connection" is triggered with type as "hardwareHandler"', done => {
    const boardListenerSpy = sinon.spy()

    const setup = proxyquire('../../app/socketSetup', {
      'socket.io': sinon.stub().returns(io),
      './board/listeners': boardListenerSpy,
    })

    socket.handshake = {
      query: {type: 'hardwareHandler'},
    }
    io.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'connection') {
        handler(socket)
      }
    })

    const serverInstance = {
      globalState: {},
    }
    setup(serverInstance)

    assert(boardListenerSpy.calledOnce)
    assert(boardListenerSpy.calledWithExactly(io, socket, serverInstance.globalState))

    done()
  })

  it('should setup the client listeners when "general/specifyClient" is triggered with type as undefined', done => {
    const clientListenerSpy = sinon.spy()

    const setup = proxyquire('../../app/socketSetup', {
      'socket.io': sinon.stub().returns(io),
      './client/listeners': clientListenerSpy,
    })

    socket.handshake = {
      query: {type: undefined},
    }
    io.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'connection') {
        handler(socket)
      }
    })

    const serverInstance = {
      globalState: {},
    }
    setup(serverInstance)

    assert(clientListenerSpy.calledOnce)
    assert(clientListenerSpy.calledWithExactly(io, socket, serverInstance.globalState))

    done()
  })
})
