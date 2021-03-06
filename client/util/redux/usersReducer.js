import callBuilder from '../apiConnection'

export const getUsersAction = () => {
  const route = '/user'
  const prefix = 'GET_USERS'
  return callBuilder(route, prefix)
}

export const toggleStudentEligiblityAction = ({ studentNumber, reason }) => {
  const route = `/student/${studentNumber}/eligible`
  const prefix = 'TOGGLE_STUDENT_ELIGIBILITY'
  const method = 'post'
  const data = { reason }
  return callBuilder(route, prefix, method, data)
}

export const markDeviceReturnedAction = (studentNumber) => {
  const route = `/student/${studentNumber}/deviceReturned`
  const prefix = 'MARK_DEVICE_RETURNED'
  const method = 'post'
  return callBuilder(route, prefix, method)
}

export const toggleUserRoleAction = (id, role) => {
  const route = `/user/${id}/${role}`
  const prefix = 'TOGGLE_USER_ROLE'
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

export const updateUserStudyPrograms = ({ id, studyPrograms }) => {
  const route = `/user/${id}/study_programs`
  const prefix = 'UPDATE_USER_STUDY_PROGRAMS'
  const method = 'post'
  const data = { studyPrograms }
  return callBuilder(route, prefix, method, data)
}

export const updateSerial = (studentNumber, newSerial) => {
  const route = `/student/${studentNumber}/serial`
  const prefix = 'UPDATE_STUDENT_SERIAL'
  const method = 'post'
  const data = { newSerial }
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

    case 'TOGGLE_STUDENT_ELIGIBILITY_SUCCESS':
      return {
        ...state,
        data: handleUsersUpdate(action.response, state.data),
      }
    case 'MARK_DEVICE_RETURNED_SUCCESS':
      return {
        ...state,
        data: handleUsersUpdate(action.response, state.data),
      }
    case 'TOGGLE_USER_ROLE_SUCCESS':
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
    case 'UPDATE_USER_STUDY_PROGRAMS_FAILURE':
      return {
        ...state,
        error: true,
      }
    case 'UPDATE_USER_STUDY_PROGRAMS_SUCCESS':
      return {
        ...state,
        data: handleUsersUpdate(action.response, state.data),
        error: false,
      }
    case 'UPDATE_STUDENT_SERIAL_SUCCESS':
      return {
        ...state,
        data: handleUsersUpdate(action.response, state.data),
        error: false,
      }
    case 'UPDATE_STUDENT_SERIAL_FAILURE':
      return {
        ...state,
        error: true,
      }
    default:
      return state
  }
}
