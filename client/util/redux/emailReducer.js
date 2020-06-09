import callBuilder from '../apiConnection'

export const sendEmail = (data) => {
  const route = '/email/send'
  const prefix = 'SEND_EMAIL'
  const method = 'post'
  return callBuilder(route, prefix, method, data)
}

export const getTemplates = () => {
  const route = '/email/template'
  const prefix = 'GET_TEMPLATES'
  return callBuilder(route, prefix)
}

export const updateReadyTemplate = (data) => {
  const route = '/email/autosend_template'
  const prefix = 'UPDATE_READY_TEMPLATE'
  return callBuilder(route, prefix, 'post', { ...data, type: 'AUTOSEND_WHEN_READY' })
}

const initialState = { pending: false, error: false, templates: [] }

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
    case 'GET_TEMPLATES_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_TEMPLATES_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        templates: action.response,
      }
    case 'GET_TEMPLATES_FAILURE':
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
        templates: state.templates.map(template => (
          template.type === 'AUTOSEND_WHEN_READY' ? action.response : template)),
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
