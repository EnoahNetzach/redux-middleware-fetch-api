import { fromJS, Map } from 'immutable'
import {
  API_REQUEST_START,
  API_REQUEST_ABORT,
  API_REQUEST_END,
  API_REQUEST_CLEAR,
  METHOD_GET,
} from '../actions'
import Api from '../definition'
import reducer from '../reducer'

const state = fromJS({
  1: new Api({ id: 1 }),
  2: new Api({ id: 2 }),
  3: new Api({ id: 3 }),
  4: new Api({
    action: 'ACTION_TYPE',
    body: {},
    endpoint: 'endpoint',
    method: METHOD_GET,
    id: 4,
    type: API_REQUEST_START,
  }),
})

describe('Api calls reducer', () => {
  it('returns an empty Map initially', () => {
    expect(reducer(undefined, {})).toEqual(new Map())
  })

  it('returns the state as is if no id or endpoint is provided in the payload', () => {
    expect(reducer(state, { type: API_REQUEST_START, payload: {} })).toEqual(state)
  })

  it('returns the state as is with an unknown action', () => {
    expect(reducer(state, {
      type: 'UNKNOWN_TYPE',
      payload: {
        action: 'ACTION_TYPE',
        body: {},
        endpoint: 'endpoint',
        method: METHOD_GET,
        id: 5,
      },
    })).toEqual(state)
  })

  it('sets the call when starting a request', () => {
    expect(reducer(state, {
      type: API_REQUEST_START,
      payload: {
        action: 'ACTION_TYPE',
        body: {},
        endpoint: 'endpoint',
        method: METHOD_GET,
        id: 5,
      },
    })).toEqual(state.set(5, new Api({
      action: 'ACTION_TYPE',
      body: {},
      endpoint: 'endpoint',
      method: METHOD_GET,
      id: 5,
      type: API_REQUEST_START,
    })))
  })

  it('updates the call when aborting the request', () => {
    expect(reducer(state, {
      type: API_REQUEST_ABORT,
      payload: {
        action: 'ACTION_TYPE',
        body: {},
        endpoint: 'endpoint',
        method: METHOD_GET,
        id: 4,
      },
    })).toEqual(state.set(4, new Api({
      action: 'ACTION_TYPE',
      body: {},
      endpoint: 'endpoint',
      method: METHOD_GET,
      id: 4,
      type: API_REQUEST_ABORT,
    })))
  })

  it('updates the call when finishing the request', () => {
    expect(reducer(state, {
      type: API_REQUEST_END,
      payload: {
        action: 'ACTION_TYPE',
        body: {},
        endpoint: 'endpoint',
        method: METHOD_GET,
        id: 4,
      },
    })).toEqual(state.set(4, new Api({
      action: 'ACTION_TYPE',
      body: {},
      endpoint: 'endpoint',
      method: METHOD_GET,
      id: 4,
      type: API_REQUEST_END,
    })))
  })

  it('removes the call when it cleared', () => {
    expect(reducer(state, {
      type: API_REQUEST_CLEAR,
      payload: {
        action: 'ACTION_TYPE',
        body: {},
        endpoint: 'endpoint',
        method: METHOD_GET,
        id: 4,
      },
    })).toEqual(state.delete(4))
  })
})
