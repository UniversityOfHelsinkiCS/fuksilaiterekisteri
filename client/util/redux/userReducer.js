import callBuilder from '../apiConnection'

/**
 * Actions and reducers are in the same file for readability
 */
export const getUserAction = () => {
  const route = '/login'
  const prefix = 'GET_USER'
  return callBuilder(route, prefix, 'post')
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: undefined }, action) => {
  switch (action.type) {
    case 'GET_USER_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_USER_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_USER_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'NEW_DEVICE_REQUEST_SUCCESS':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.response,
        },
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
