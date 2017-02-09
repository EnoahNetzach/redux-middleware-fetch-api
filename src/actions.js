export const API_REQUEST_START = 'API_REQUEST_START'
export const API_REQUEST_ABORT = 'API_REQUEST_ABORT'
export const API_REQUEST_END = 'API_REQUEST_END'
export const API_REQUEST_CLEAR = 'API_REQUEST_CLEAR'

export const METHOD_GET = 'GET'
export const METHOD_POST = 'POST'
export const METHOD_PATCH = 'PATCH'
export const METHOD_DELETE = 'DELETE'

export const startRequest = ({ requestId, endpoint, method = METHOD_GET, body, action }) => ({
  type: API_REQUEST_START,
  payload: {
    id: requestId,
    endpoint,
    method,
    body,
    action,
  },
})

export const abortRequest = ({ requestId, endpoint, method = METHOD_GET, action }) => ({
  type: API_REQUEST_ABORT,
  payload: {
    id: requestId,
    endpoint,
    method,
    action,
  },
})

export const finishRequest = ({ requestId, endpoint, method = METHOD_GET, action }) => ({
  type: API_REQUEST_END,
  payload: {
    id: requestId,
    endpoint,
    method,
    action,
  },
})

export const clearRequest = ({ requestId }) => ({
  type: API_REQUEST_CLEAR,
  payload: {
    id: requestId,
  },
})
