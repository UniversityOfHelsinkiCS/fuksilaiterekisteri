import { combineReducers } from 'redux'

import messages from './messageReducer'
import user from './userReducer'
import student from './studentReducer'
import users from './usersReducer'
import deviceClaim from './deviceClaimReducer'
import deviceRequest from './deviceRequestReducer'
import notification from './notificationReducer'
import email from './emailReducer'
import serviceStatus from './serviceStatusReducer'
import common from './localeReducer'
import studyProgrammes from './studyProgrammeReducer'
import reclaimCases from './reclaimCaseReducer'

export default combineReducers({
  messages,
  user,
  student,
  users,
  deviceClaim,
  deviceRequest,
  notification,
  email,
  serviceStatus,
  common,
  studyProgrammes,
  reclaimCases,
})
