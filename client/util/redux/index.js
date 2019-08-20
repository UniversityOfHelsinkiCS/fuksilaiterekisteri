import { combineReducers } from 'redux'

import messages from './messageReducer'
import user from './userReducer'

export default combineReducers({
  messages,
  user,
})
