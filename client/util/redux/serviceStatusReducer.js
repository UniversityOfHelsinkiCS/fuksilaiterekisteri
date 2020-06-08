import callBuilder from '../apiConnection'

export const getServiceStatus = () => {
  const route = '/serviceStatus'
  const prefix = 'GET_SERVICE_STATUS'
  return callBuilder(route, prefix)
}

export const setServiceStatus = (newOptions) => {
  const route = '/serviceStatus'
  const prefix = 'SET_SERVICE_STATUS'
  return callBuilder(route, prefix, 'post', newOptions)
}

const initialState = { data: null, pending: false, error: false }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_SERVICE_STATUS_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'SET_SERVICE_STATUS_SUCCESS':
      return {
        ...state,
        data: action.response,
      }

    default:
      return state
  }
}
