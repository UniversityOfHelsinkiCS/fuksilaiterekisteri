import { combineReducers } from 'redux'

import messages from './messageReducer'
import user from './userReducer'
import student from './studentReducer'
import users from './usersReducer'
import deviceClaim from './deviceClaimReducer'
import deviceRequest from './deviceRequestReducer'

export default combineReducers({
  messages,
  user,
  student,
  users,
  deviceClaim,
  deviceRequest,
})
