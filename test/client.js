const sinon = require('sinon')
const assert = require('assert')

const {HARDWARE_ACTIONS} = require('../app/constants')
const clientListener = require('../app/client/listeners')

describe('Client', () => {
  let io
  let state
  let socket

  function _getSocketClient () {
    return {
      on: sinon.spy(),
      emit: sinon.spy(),
      join: sinon.spy(),
      leave: sinon.spy()
    }
  }

  beforeEach(() => {
    socket = _getSocketClient()

    state = {
      lamps: []
      // "hardwareHandler" will be evaluated to undefined
    }

    io = {
      emit: sinon.spy(),
      clients: sinon.spy()
    }
    io.to = sinon.stub().returns(io)
    io.of = sinon.stub().returns(io)
    io.in = sinon.stub().returns(io)

    HARDWARE_ACTIONS.clear()
  })

  it('should join the end users room', done => {
    clientListener(io, socket, state)

    assert(socket.join.calledWith('endUsers'))
    done()
  })

  it('should broadcast "client/clientsConnected" after successful connection', done => {
    const _clientsConnected = ['client 1', 'client 2']
    io.clients = fn => {
      fn('whatever', _clientsConnected)
    }

    clientListener(io, socket, state)

    assert(io.to.calledOnce)
    assert(io.to.calledWithExactly('endUsers'))
    assert(io.emit.calledOnce)
    assert(io.emit.calledWithExactly('client/clientsConnected', {data: _clientsConnected.length}))
    done()
  })

  it('should set "client/getLampsState" listener', done => {
    clientListener(io, socket, state)

    assert(socket.on.calledWithExactly('client/getLampsState', sinon.match.func))
    done()
  })

  it('should emit "client/lampsState" with lamps state when "client/getLampsState" is triggered', done => {
    socket.on = (event, handler) => {
      if (event === 'client/getLampsState') {
        handler()
      }
    }

    clientListener(io, socket, state)

    assert(socket.emit.calledOnce)
    assert(socket.emit.calledWithExactly('client/lampsState', state.lamps))
    done()
  })

  it('should set "client/lampsAction" listener', done => {
    clientListener(io, socket, state)

    assert(socket.on.calledWithExactly('client/lampsAction', sinon.match.func))
    done()
  })

  it('should emit "hardware/action" from board socket client when "client/lampsAction" is triggered with valid target and action', done => {
    const action = 'an action'
    HARDWARE_ACTIONS.add(action)

    const actionData = {target: 'a board pin', action}

    socket.on = (event, handler) => {
      if (event === 'client/lampsAction') {
        handler(actionData)
      }
    }

    state.hardwareHandler = _getSocketClient()

    clientListener(io, socket, state)

    assert(state.hardwareHandler.emit.calledOnce)
    assert(state.hardwareHandler.emit.calledWithExactly('hardware/action', actionData))
    done()
  })

  it('should emit "client/response" with error message when "client/lampsAction" is triggered and there is no board connected', done => {
    socket.on = (event, handler) => {
      if (event === 'client/lampsAction') {
        handler()
      }
    }

    clientListener(io, socket, state)

    assert(socket.emit.calledOnce)
    assert(socket.emit.calledWithExactly('client/response', {message: 'No handler connected.'}))
    done()
  })

  it('should emit "client/response" with error message when "client/lampsAction" is triggered with valid target and invalid action', done => {
    const actionData = {target: 'a board pin', action: 'an action not added to HARDWARE_HANDLER'}

    state.hardwareHandler = _getSocketClient()

    socket.on = (event, handler) => {
      if (event === 'client/lampsAction') {
        handler(actionData)
      }
    }

    clientListener(io, socket, state)

    assert(socket.emit.calledOnce)
    assert(socket.emit.calledWithExactly('client/response', {message: 'You sent invalid data.'}))
    done()
  })

  it('should set "disconnect" listener', done => {
    clientListener(io, socket, state)

    assert(socket.on.calledWithExactly('disconnect', sinon.match.func))
    done()
  })

  it('should leave the room when user disconnects', done => {
    socket.on = (event, handler) => {
      if (event === 'disconnect') {
        handler()
      }
    }

    clientListener(io, socket, state)

    assert(socket.leave.calledOnce)
    assert(socket.leave.calledWithExactly('endUsers'))
    done()
  })

  it('should emit "client/clientsConnected" to all clients when a user disconnects', done => {
    const _clientsConnected = ['client 1', 'client 2']

    // This is called on connection and on "disconnect" handler.
    // Running this on the second call (onCall 1) because is when the "disconnect" handler is triggered
    io.clients = sinon.stub().onCall(1).callsFake(fn => {
      fn('some value', _clientsConnected)
    })

    socket.on = (event, handler) => {
      if (event === 'disconnect') {
        handler()
      }
    }

    clientListener(io, socket, state)

    assert(io.to.calledOnce)
    assert(io.to.calledWithExactly('endUsers'))
    assert(io.emit.calledOnce)
    assert(io.emit.calledWithExactly('client/clientsConnected', {data: _clientsConnected.length}))
    done()
  })
})
