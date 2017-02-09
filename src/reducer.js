import { Map } from 'immutable'
import {
  API_REQUEST_START,
  API_REQUEST_ABORT,
  API_REQUEST_END,
  API_REQUEST_CLEAR,
  METHOD_GET,
} from './actions'
import Api from './definition'

export default (state = new Map(), { type, payload }) => {
  if (!payload) {
    return state
  }

  const { action, id, endpoint, method = METHOD_GET, body = {} } = payload

  if (!id || !endpoint) {
    return state
  }

  switch (type) {
    case API_REQUEST_START:
    case API_REQUEST_ABORT:
    case API_REQUEST_END:
      return state.set(id, new Api({
        action,
        body,
        endpoint,
        method,
        id,
        type,
      }))
    case API_REQUEST_CLEAR:
      return state.delete(id)
    default:
      return state
  }
}
