import fetch from 'isomorphic-fetch'
import uuid from 'uuid'
import {
  API_REQUEST_ABORT,
  METHOD_GET,
  startRequest,
  abortRequest,
  finishRequest,
  clearRequest,
} from './actions'
import selector from './selector'

export const CALL_API = Symbol('Call API')

const callApi = async ({
  abortCurrentRequest,
  body,
  endpoint,
  endCurrentRequest,
  headers,
  wasAborted,
  method,
}) => {
  const response = await fetch(endpoint, {
    method,
    headers,
    body: method === METHOD_GET ? undefined : JSON.stringify(body),
    credentials: 'same-origin',
  })

  const contentType = response.headers.get('content-type')

  const payload = contentType && contentType.indexOf('json') > -1
    ? await response.json()
    : await response.text()

  if (wasAborted()) {
    abortCurrentRequest()
    throw new Error('The request was aborted.')
  }

  if (!response.ok) {
    throw payload
  }

  endCurrentRequest()

  return {
    payload,
    ok: response.ok,
  }
}

export default store => next => async (action) => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  if (typeof callAPI.payload === 'undefined') {
    throw new Error('Expected a payload.')
  }

  const { payload, meta = {} } = callAPI

  const types = payload.types || {}
  const endpoint = payload.endpoint
  const method = payload.method || METHOD_GET
  const headers = payload.headers
  const body = payload.body

  const expiryTime = meta.expiry || 5000
  const extraPayload = meta.extraPayload
  const extraMeta = meta.extraMeta

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }

  const makeAction = (data) => {
    const newAction = { ...action, ...data }
    delete newAction[CALL_API]
    return newAction
  }

  next(makeAction({
    type: types.request,
    payload: extraPayload,
    meta: extraMeta,
  }))

  const currentRequestId = uuid.v4()

  const wasAborted = () =>
    selector(store.getState(), { id: currentRequestId, type: API_REQUEST_ABORT }).length > 0

  if (types.request) {
    store.dispatch(startRequest({ action: types.request, requestId: currentRequestId, endpoint, method }))
  }

  const abortCurrentRequest = () => types.failure && store.dispatch(
    abortRequest({ action: types.failure, requestId: currentRequestId, endpoint, method }),
  )
  const endCurrentRequest = () => types.success && store.dispatch(
    finishRequest({ action: types.success, requestId: currentRequestId, endpoint, method }),
  )

  let error
  let response = {}

  try {
    response = await callApi({
      abortCurrentRequest,
      body,
      endpoint,
      endCurrentRequest,
      headers,
      method,
      wasAborted,
    })
  } catch (err) {
    abortCurrentRequest()
    error = err
  }

  setTimeout(() => {
    store.dispatch(clearRequest({ requestId: currentRequestId }))
  }, expiryTime)

  return next(makeAction({
    type: response.ok ? types.success : types.failure,
    payload: {
      ...extraPayload,
      error,
      response: response.payload,
    },
    error: !response.ok || !!error,
    meta: extraMeta,
  }))
}
