import callBuilder from '../apiConnection'

export const getStudyProgrammesAction = () => {
  const route = '/studyProgrammes'
  const prefix = 'GET_STUDYPROGRAMMES'
  const method = 'get'
  return callBuilder(route, prefix, method)
}

export const updateStudyProgrammesAction = (data) => {
  const route = '/studyProgrammes'
  const prefix = 'UPDATE_STUDYPROGRAMMES'
  const method = 'post'
  return callBuilder(route, prefix, method, data)
}

const initialState = { data: [], error: false }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_STUDYPROGRAMMES_SUCCESS':
      return {
        data: action.response,
      }
    case 'UPDATE_STUDYPROGRAMMES_SUCCESS':
      return {
        data: action.response,
        error: false,
      }
    case 'UPDATE_STUDYPROGRAMMES_FAILURE':
      return {
        ...state,
        error: true,
      }
    default:
      return state
  }
}
