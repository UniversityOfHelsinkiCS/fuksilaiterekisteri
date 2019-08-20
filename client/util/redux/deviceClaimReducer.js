import callBuilder from '../apiConnection'

/**
 * Actions and reducers are in the same file for readability
 */
export const claimDeviceAction = ({ studentNumber }) => {
  const route = '/claim_device'
  const prefix = 'NEW_DEVICE_CLAIM'
  return callBuilder(route, prefix, 'post', { studentNumber })
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: undefined }, action) => {
  switch (action.type) {
    case 'NEW_DEVICE_CLAIM_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'NEW_DEVICE_CLAIM_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'NEW_DEVICE_CLAIM_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
