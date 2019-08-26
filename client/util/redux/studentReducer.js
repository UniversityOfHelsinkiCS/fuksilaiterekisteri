import callBuilder from '../apiConnection'

/**
 * Actions and reducers are in the same file for readability
 */
export const getStudentAction = (studentNumber) => {
  const route = `/student/${studentNumber}`
  const prefix = 'GET_STUDENT'
  return callBuilder(route, prefix)
}

export const getStudentsAction = () => {
  const route = '/staff/students'
  const prefix = 'GET_STUDENTS'
  return callBuilder(route, prefix)
}

export const updateStudentStatus = ({ digiSkills, enrolled, studentNumber }) => {
  const route = `/student/${studentNumber}/status`
  const prefix = 'UPDATE_STUDENT_STATUS'
  const method = 'post'
  const data = { digiSkills, enrolled }
  return callBuilder(route, prefix, method, data)
}

export const clearStudentAction = () => ({
  type: 'CLEAR_STUDENT',
})

const handleStudentUpdate = (updatedStudent, data) => {
  console.log('STUDENT!!', updatedStudent)
  console.log('dADADADAa', data)
  return data.map(student => (student.id === updatedStudent.id ? updatedStudent : student))
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
const INITIAL_STATE = { data: undefined, students: [] }

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CLEAR_STUDENT':
      return INITIAL_STATE
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
    case 'GET_STUDENTS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_STUDENTS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_STUDENTS_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        students: action.response,
      }
    case 'UPDATE_STUDENT_STATUS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'UPDATE_STUDENT_STATUS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'UPDATE_STUDENT_STATUS_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        students: handleStudentUpdate(action.response, state.students),
      }

    default:
      return state
  }
}
