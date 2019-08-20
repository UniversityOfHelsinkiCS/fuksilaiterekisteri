import callBuilder from '../apiConnection'

/**
 * Actions and reducers are in the same file for readability
 */
export const newDeviceRequestAction = ({ email }) => {
  const route = '/device_request'
  const prefix = 'NEW_DEVICE_REQUEST'
  return callBuilder(route, prefix, 'post', { email })
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: undefined }, action) => {
  switch (action.type) {
    case 'NEW_DEVICE_REQUEST_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'NEW_DEVICE_REQUEST_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'NEW_DEVICE_REQUEST_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
