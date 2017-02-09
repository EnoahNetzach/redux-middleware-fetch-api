import { createSelector } from 'reselect'

let getState = () => {
  throw new Error('No `getState` function defined.')
}

export const setGetState = (fn) => {
  getState = fn
}

export default createSelector(
  state => getState(state),
  (state, { id } = {}) => id,
  (state, { action } = {}) => action,
  (state, { endpoint, method } = {}) => ({ endpoint, method }),
  (state, { type } = {}) => type,
  (requests, id, action, { endpoint, method }, type) => requests
    .filter(request => typeof request !== 'undefined')
    .filter(request => !id || request.id === id)
    .filter(request => !action || (Array.isArray(action)
      ? action.find(a => request.action === a)
      : request.action === action
    ))
    .filter(request => !(endpoint && method) || (request.endpoint === endpoint && request.method === method))
    .filter(request => !type || (Array.isArray(type)
        ? type.find(t => request.type === t)
        : request.type === type
    ))
    .toArray(),
)
