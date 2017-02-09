import * as libActions from './dist/actions'
import libDefinition from './dist/definition'
import middleware, { CALL_API as callApi } from './dist/middleware'
import libReducer from './dist/reducer'
import libSelector, { setGetState } from './dist/selector'

export default (getState) => {
  setGetState(getState)

  return middleware
}

export const actions = libActions

export const CALL_API = callApi

export const definition = libDefinition

export const reducer = libReducer

export const selector = libSelector
