export const API_REQUEST_START = 'API_REQUEST_START'
export const API_REQUEST_ABORT = 'API_REQUEST_ABORT'
export const API_REQUEST_END = 'API_REQUEST_END'
export const API_REQUEST_CLEAR = 'API_REQUEST_CLEAR'

export const METHOD_GET = 'GET'
export const METHOD_POST = 'POST'
export const METHOD_PATCH = 'PATCH'
export const METHOD_DELETE = 'DELETE'

export const startRequest = (...args) => startRequest.implementation(...args)
startRequest.implementation = () => {}

export const abortRequest = (...args) => abortRequest.implementation(...args)
abortRequest.implementation = () => {}

export const finishRequest = (...args) => finishRequest.implementation(...args)
finishRequest.implementation = () => {}

export const clearRequest = (...args) => clearRequest.implementation(...args)
clearRequest.implementation = () => {}
