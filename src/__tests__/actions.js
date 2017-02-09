import {
  API_REQUEST_START,
  API_REQUEST_ABORT,
  API_REQUEST_END,
  METHOD_GET,
  METHOD_POST,
  startRequest,
  abortRequest,
  finishRequest,
} from '../actions'

const MOCK_ACTION = 'MOCK_ACTION'

describe('API actions', () => {
  describe('start request', () => {
    it('is FSA compliant', () => {
      expect(startRequest({
        action: MOCK_ACTION,
        endpoint: 'endpoint',
        requestId: 'reqid',
      })).toEqual({
        type: API_REQUEST_START,
        payload: {
          action: MOCK_ACTION,
          body: undefined,
          endpoint: 'endpoint',
          id: 'reqid',
          method: METHOD_GET,
        },
      })
    })

    it('is FSA compliant (with method)', () => {
      expect(startRequest({
        action: MOCK_ACTION,
        body: { test: 'test' },
        endpoint: 'endpoint',
        method: METHOD_POST,
        requestId: 'reqid',
      })).toEqual({
        type: API_REQUEST_START,
        payload: {
          action: MOCK_ACTION,
          body: { test: 'test' },
          endpoint: 'endpoint',
          id: 'reqid',
          method: METHOD_POST,
        },
      })
    })
  })

  describe('abort request', () => {
    it('is FSA compliant', () => {
      expect(abortRequest({
        action: MOCK_ACTION,
        endpoint: 'endpoint',
        requestId: 'reqid',
      })).toEqual({
        type: API_REQUEST_ABORT,
        payload: {
          action: MOCK_ACTION,
          endpoint: 'endpoint',
          id: 'reqid',
          method: METHOD_GET,
        },
      })
    })
  })

  describe('finish request', () => {
    it('is FSA compliant', () => {
      expect(finishRequest({
        action: MOCK_ACTION,
        endpoint: 'endpoint',
        requestId: 'reqid',
      })).toEqual({
        type: API_REQUEST_END,
        payload: {
          action: MOCK_ACTION,
          endpoint: 'endpoint',
          id: 'reqid',
          method: METHOD_GET,
        },
      })
    })
  })
})
