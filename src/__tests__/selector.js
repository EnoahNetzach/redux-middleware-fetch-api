import { fromJS } from 'immutable'
import {
  API_REQUEST_START,
  API_REQUEST_ABORT,
  METHOD_GET,
} from '../actions'
import Api from '../definition'
import selector, { setGetState } from '../selector'

setGetState(state => state.get('api'))

const state = fromJS({
  api: {
    1: new Api({
      action: 'ACTION_TYPE_1',
      body: {},
      endpoint: 'endpoint1',
      method: METHOD_GET,
      id: 1,
      type: API_REQUEST_START,
    }),
    2: new Api({
      action: 'ACTION_TYPE_1',
      body: {},
      endpoint: 'endpoint2',
      method: METHOD_GET,
      id: 2,
      type: API_REQUEST_ABORT,
    }),
    3: new Api({
      action: 'ACTION_TYPE_2',
      body: {},
      endpoint: 'endpoint3',
      method: METHOD_GET,
      id: 3,
      type: API_REQUEST_START,
    }),
    4: new Api({
      action: 'ACTION_TYPE_3',
      body: {},
      endpoint: 'endpoint4',
      method: METHOD_GET,
      id: 4,
      type: API_REQUEST_START,
    }),
  },
})

describe('Api calls selector', () => {
  it('returns the whole state by default', () => {
    expect(selector(state)).toEqual(state.get('api').toArray())
  })

  it('filters the requests by id', () => {
    expect(selector(state, { id: 3 })).toEqual([state.get('api').get('3')])
  })

  it('filters the requests by action', () => {
    expect(selector(state, { action: 'ACTION_TYPE_1' })).toEqual([
      state.get('api').get('1'),
      state.get('api').get('2'),
    ])
  })

  it('filters the requests by endpoint and method', () => {
    expect(selector(state, { endpoint: 'endpoint4', method: METHOD_GET })).toEqual([state.get('api').get('4')])
  })

  it('filters the requests by type', () => {
    expect(selector(state, { type: API_REQUEST_START })).toEqual([
      state.get('api').get('1'),
      state.get('api').get('3'),
      state.get('api').get('4'),
    ])
  })
})
