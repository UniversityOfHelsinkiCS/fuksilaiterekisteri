import callBuilder from '../apiConnection'

/**
 * Actions and reducers are in the same file for readability
 */
export const getStudentAction = (studentNumber) => {
  const route = `/student/${studentNumber}`
  const prefix = 'GET_STUDENT'
  return callBuilder(route, prefix)
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: undefined }, action) => {
  switch (action.type) {
    case 'GET_STUDENT_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_STUDENT_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_STUDENT_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
