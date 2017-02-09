import { Record } from 'immutable'
import { METHOD_GET } from './actions'

export default Record({
  id: '',
  action: '',
  body: undefined,
  endpoint: '',
  method: METHOD_GET,
  type: '',
})
