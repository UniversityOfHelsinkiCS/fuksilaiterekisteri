import callBuilder from '../apiConnection'

export const customTextSelector = (state) => {
  if (!state.serviceStatus.data || !state.serviceStatus.data.customTexts) return undefined
  return state.serviceStatus.data.customTexts
}

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
    case 'SET_SERVICE_STATUS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'SET_SERVICE_STATUS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'SET_SERVICE_STATUS_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        data: action.response,
      }

    default:
      return state
  }
}
