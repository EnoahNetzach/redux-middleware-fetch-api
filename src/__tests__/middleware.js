import fetch from 'isomorphic-fetch'
import selector from '../selector'
import {
  API_REQUEST_ABORT,
  METHOD_GET,
  startRequest,
  abortRequest,
  finishRequest,
} from '../actions'
import api, { CALL_API } from '../middleware'

jest.mock('../actions')
jest.mock('../selector')

jest.mock('isomorphic-fetch', () => {
  const mockedFetch = () => ({
    headers: { get: () => '' },
    json: () => '',
    ok: mockedFetch.mockOk,
    text: () => '',
  })
  mockedFetch.mockOk = true

  return mockedFetch
})

const mockStore = {
  dispatch: () => {},
  getState: () => {},
}

const FAILURE_TYPE = 'FAILURE_TYPE'
const REQUEST_TYPE = 'REQUEST_TYPE'
const SUCCESS_TYPE = 'SUCCESS_TYPE'

const selectorImplementation = selector.implementation

describe('api middleware', () => {
  beforeEach(() => {
    selector.implementation = selectorImplementation
    fetch.mockOk = true
  })

  it('is a higher order function', () => {
    expect(typeof api).toEqual('function')
    expect(typeof api({})).toEqual('function')
    expect(typeof api({})(() => {})).toEqual('function')
  })

  it('passes on unrecognized actions', async () => {
    const func = { next: a => a }

    spyOn(func, 'next').and.callThrough()

    const mockAction = { type: 'MOCK_ACTION' }
    const action = await api({})(func.next)(mockAction)

    expect(func.next.calls.count()).toEqual(1)
    expect(action).toEqual(mockAction)
  })

  it('throws if no data is provided', async () => {
    let errorMessage
    try {
      await api({})(() => {})({
        [CALL_API]: {
          type: 'MOCK_ACTION',
        },
      })
    } catch (error) {
      errorMessage = error.message
    }
    expect(errorMessage).toEqual('Expected a payload.')
  })

  it('throws if endpoint is not a string', async () => {
    let errorMessage
    try {
      await api({})(() => {})({
        [CALL_API]: {
          payload: {
            types: [REQUEST_TYPE, SUCCESS_TYPE, FAILURE_TYPE],
            endpoint: 42,
          },
          meta: {},
        },
      })
    } catch (error) {
      errorMessage = error.message
    }
    expect(errorMessage).toEqual('Specify a string endpoint URL.')
  })

  it('calls the request action', async () => {
    const func = { next: a => a }

    spyOn(func, 'next')

    await api(mockStore)(func.next)({
      [CALL_API]: {
        type: 'MOCK_ACTION',
        payload: {
          types: {
            request: REQUEST_TYPE,
            success: SUCCESS_TYPE,
            failure: FAILURE_TYPE,
          },
          endpoint: 'endpoint',
        },
      },
    })

    expect(func.next).toHaveBeenCalledWith({
      type: REQUEST_TYPE,
    })
  })

  it('handles an OK request', async () => {
    const func = { next: () => {} }

    spyOn(func, 'next')
    spyOn(startRequest, 'implementation')
    spyOn(finishRequest, 'implementation')

    await api(mockStore)(func.next)({
      [CALL_API]: {
        payload: {
          types: {
            request: REQUEST_TYPE,
            success: SUCCESS_TYPE,
            failure: FAILURE_TYPE,
          },
          endpoint: 'endpoint',
        },
      },
    })

    expect(startRequest.implementation).toHaveBeenCalledWith({
      action: REQUEST_TYPE,
      requestId: jasmine.any(String),
      endpoint: 'endpoint',
      method: METHOD_GET,
    })
    expect(finishRequest.implementation).toHaveBeenCalledWith({
      action: SUCCESS_TYPE,
      requestId: jasmine.any(String),
      endpoint: 'endpoint',
      method: METHOD_GET,
    })
    expect(func.next).toHaveBeenCalledWith({
      type: SUCCESS_TYPE,
      payload: {
        error: undefined,
        response: '',
      },
      error: false,
      meta: undefined,
    })
  })

  it('handles an abort action', async () => {
    selector.implementation = () => [{ type: API_REQUEST_ABORT }]

    const func = { next: a => a }

    spyOn(func, 'next')
    spyOn(abortRequest, 'implementation')

    await api(mockStore)(func.next)({
      [CALL_API]: {
        payload: {
          types: {
            request: REQUEST_TYPE,
            success: SUCCESS_TYPE,
            failure: FAILURE_TYPE,
          },
          endpoint: 'endpoint',
        },
      },
    })

    expect(abortRequest.implementation).toHaveBeenCalledWith({
      action: FAILURE_TYPE,
      requestId: jasmine.any(String),
      endpoint: 'endpoint',
      method: METHOD_GET,
    })
    expect(func.next).toHaveBeenCalledWith({
      type: FAILURE_TYPE,
      payload: {
        error: jasmine.any(Error),
      },
      error: true,
    })
  })

  it('handles a failure request action', async () => {
    const func = { next: a => a }

    spyOn(func, 'next')
    spyOn(finishRequest, 'implementation')

    fetch.mockOk = false

    await api(mockStore)(func.next)({
      [CALL_API]: {
        payload: {
          types: {
            request: REQUEST_TYPE,
            success: SUCCESS_TYPE,
            failure: FAILURE_TYPE,
          },
          endpoint: 'endpoint',
        },
      },
    })

    expect(finishRequest.implementation).not.toHaveBeenCalled()
    expect(func.next).toHaveBeenCalledWith({
      type: FAILURE_TYPE,
      payload: {
        error: jasmine.anything(),
        response: undefined,
      },
      error: true,
    })
  })
})
