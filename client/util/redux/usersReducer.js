import callBuilder from '../apiConnection'

export const getUsersAction = () => {
  const route = '/user'
  const prefix = 'GET_USERS'
  return callBuilder(route, prefix)
}

export const markStudentEligible = (studentNumber) => {
  const route = `/student/${studentNumber}/eligible`
  const prefix = 'MARK_STUDENT_ELIGIBLE'
  const method = 'post'
  return callBuilder(route, prefix, method)
}

export const toggleUserStaff = (id) => {
  const route = `/user/${id}/staff`
  const prefix = 'TOGGLE_USER_STAFF'
  const method = 'post'
  return callBuilder(route, prefix, method)
}

export const toggleUserDistributor = (id) => {
  const route = `/user/${id}/distributor`
  const prefix = 'TOGGLE_USER_DISTRIBUTOR'
  const method = 'post'
  return callBuilder(route, prefix, method)
}

const INITIAL_STATE = { data: [] }

const handleUsersUpdate = (updatedUser, data) => data.map(user => (user.id === updatedUser.id ? updatedUser : user))

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_USERS_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_USERS_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_USERS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }

    case 'MARK_STUDENT_ELIGIBLE_SUCCESS':
      return {
        ...state,
        data: handleUsersUpdate(action.response, state.data),
      }

    case 'TOGGLE_USER_STAFF_SUCCESS':
      return {
        ...state,
        data: handleUsersUpdate(action.response, state.data),
      }

    case 'TOGGLE_USER_DISTRIBUTOR_SUCCESS':
      return {
        ...state,
        data: handleUsersUpdate(action.response, state.data),
      }
    default:
      return state
  }
}