import callBuilder from '../apiConnection'

export const sendEmail = (data) => {
  const route = '/email/send'
  const prefix = 'SEND_EMAIL'
  const method = 'post'
  return callBuilder(route, prefix, method, data)
}

export const getReadyTemplate = () => {
  const route = '/email/template/autosend/AUTOSEND_WHEN_READY'
  const prefix = 'GET_READY_TEMPLATE'
  return callBuilder(route, prefix)
}

export const updateReadyTemplate = (subject, body) => {
  const route = '/email/template/autosend'
  const prefix = 'UPDATE_READY_TEMPLATE'
  const data = { subject, body, type: 'AUTOSEND_WHEN_READY' }
  return callBuilder(route, prefix, 'post', data)
}

const initialState = { pending: false, error: false, readyTemplate: { subject: '', body: '' } }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SEND_EMAIL_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'SEND_EMAIL_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
      }
    case 'SEND_EMAIL_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_READY_TEMPLATE_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_READY_TEMPLATE_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        readyTemplate: action.response || {},
      }
    case 'GET_READY_TEMPLATE_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'UPDATE_READY_TEMPLATE_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'UPDATE_READY_TEMPLATE_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        readyTemplate: action.response,
      }
    case 'UPDATE_READY_TEMPLATE_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
