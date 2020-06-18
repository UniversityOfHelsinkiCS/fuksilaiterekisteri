import callBuilder from '../apiConnection'

export const getUsersAction = () => {
  const route = '/user'
  const prefix = 'GET_USERS'
  return callBuilder(route, prefix)
}

export const markStudentEligible = ({ studentNumber, reason }) => {
  const route = `/student/${studentNumber}/eligible`
  const prefix = 'MARK_STUDENT_ELIGIBLE'
  const method = 'post'
  const data = { reason }
  return callBuilder(route, prefix, method, data)
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

export const toggleUserAdminAction = (id) => {
  const route = `/user/${id}/admin`
  const prefix = 'TOGGLE_USER_ADMIN'
  const method = 'post'
  return callBuilder(route, prefix, method)
}

export const setUserAdminNote = ({ id, note }) => {
  const route = `/user/${id}/admin_note`
  const prefix = 'SET_USER_ADMIN_NOTE'
  const method = 'post'
  const data = { note }
  return callBuilder(route, prefix, method, data)
}

const INITIAL_STATE = { data: [], settingAdminNote: false }

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
    case 'TOGGLE_USER_ADMIN_SUCCESS':
      return {
        ...state,
        data: handleUsersUpdate(action.response, state.data),
      }
    case 'SET_USER_ADMIN_NOTE_ATTEMPT':
      return {
        ...state,
        settingAdminNote: true,
        error: false,
      }

    case 'SET_USER_ADMIN_NOTE_FAILURE':
      return {
        ...state,
        settingAdminNote: false,
        error: true,
      }
    case 'SET_USER_ADMIN_NOTE_SUCCESS':
      return {
        ...state,
        data: handleUsersUpdate(action.response, state.data),
        settingAdminNote: false,
        error: false,
      }
    default:
      return state
  }
}
