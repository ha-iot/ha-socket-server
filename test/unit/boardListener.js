const assert = require('assert')
const sinon = require('sinon')

const {HARDWARE_ACTIONS} = require('../../app/constants')
const boardListeners = require('../../app/board/listeners')

describe('Board', () => {
  let io
  let state
  let socket

  beforeEach(() => {
    io = {
      emit: sinon.spy()
    }
    io.to = sinon.stub().returns(io)
    state = {}
    socket = {
      on: sinon.spy(),
      emit: sinon.spy()
    }
    HARDWARE_ACTIONS.clear()
  })

  it('should set its socket as the hardware handler on connection', done => {
    boardListeners(io, socket, state)

    assert(state.hardwareHandler === socket)
    done()
  })

  it('should emit "hardware/getData" on connection', done => {
    boardListeners(io, socket, state)

    assert(socket.emit.calledOnce)
    assert(socket.emit.calledWithExactly('hardware/getData'))
    done()
  })

  it('should set "hardware/data" listener', done => {
    boardListeners(io, socket, state)

    assert(socket.on.calledWithExactly('hardware/data', sinon.match.func))
    done()
  })

  it('should update the hardware actions when "hardware/data" is triggered', done => {
    const _data = {
      hardwareActions: ['action 1', 'action 2', 'action 3'],
      lampsState: 'a state object'
    }

    socket.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'hardware/data') {
        handler(_data)
      }
    })

    boardListeners(io, socket, state)

    assert(HARDWARE_ACTIONS.size === new Set(_data.hardwareActions).size)
    assert(_data.hardwareActions.every(action => HARDWARE_ACTIONS.has(action)))
    done()
  })

  it('should broadcast "client/lampsState" when "hardware/data" is triggered', done => {
    const _data = {
      hardwareActions: [],
      lampsState: 'a state object'
    }

    socket.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'hardware/data') {
        handler(_data)
      }
    })

    boardListeners(io, socket, state)

    assert(io.to.calledOnce)
    assert(io.to.calledBefore(io.emit))
    assert(io.to.calledWithExactly('endUsers'))
    assert(io.emit.calledOnce)
    assert(io.emit.calledWithExactly('client/lampsState', _data.lampsState))
    done()
  })

  it('should set "hardware/lampsState" listener', done => {
    boardListeners(io, socket, state)

    assert(socket.on.calledWithExactly('hardware/lampsState', sinon.match.func))
    done()
  })

  it('should broadcast "client/lampsState" when "hardware/lampsState" is triggered', done => {
    socket.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'hardware/lampsState') {
        handler()
      }
    })

    state.lamps = ['lamp 1', 'lamp 2', 'lamp 3']

    boardListeners(io, socket, state)

    assert(io.to.calledOnce)
    assert(io.to.calledBefore(io.emit))
    assert(io.to.calledWithExactly('endUsers'))
    assert(io.emit.calledOnce)
    assert(io.emit.calledWithExactly('client/lampsState', state.lamps))
    done()
  })

  it('should set "disconnect" listener', done => {
    boardListeners(io, socket, state)

    assert(socket.on.calledWithExactly('disconnect', sinon.match.func))
    done()
  })

  it('should clear hardware actions when "disconnect" is triggered', done => {
    socket.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'disconnect') {
        handler()
      }
    })

    HARDWARE_ACTIONS.add('random value')

    boardListeners(io, socket, state)

    assert(HARDWARE_ACTIONS.size === 0)
    done()
  })

  it('should set the hardware handler to null when "disconnect" is triggered', done => {
    socket.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'disconnect') {
        handler()
      }
    })

    state.hardwareHandler = socket

    boardListeners(io, socket, state)

    assert(state.hardwareHandler === null)
    done()
  })

  it('should broadcast empty lamp state list when "disconnect" is triggered', done => {
    socket.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'disconnect') {
        handler()
      }
    })

    state.lamps = ['lamp 1', 'lamp 2', 'lamp 3']

    boardListeners(io, socket, state)

    assert(io.to.calledOnce)
    assert(io.to.calledBefore(io.emit))
    assert(io.to.calledWithExactly('endUsers'))
    assert(io.emit.calledOnce)
    assert(io.emit.calledWithExactly('client/lampsState', []))
    done()
  })

  it('should empty the lamp state list when "disconnect" is triggered', done => {
    socket.on = sinon.stub().callsFake((event, handler) => {
      if (event === 'disconnect') {
        handler()
      }
    })

    state.lamps = ['lamp 1', 'lamp 2', 'lamp 3']

    boardListeners(io, socket, state)

    assert(state.lamps.length === 0)
    done()
  })
})
