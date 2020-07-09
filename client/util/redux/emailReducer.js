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

export const updateReadyTemplate = (subject, body, replyTo) => {
  const route = '/email/template/autosend'
  const prefix = 'UPDATE_READY_TEMPLATE'
  const data = {
    subject, body, replyTo, type: 'AUTOSEND_WHEN_READY',
  }
  return callBuilder(route, prefix, 'post', data)
}

export const getAllAdminEmailTemplatesAction = () => {
  const route = '/email/templates/admin'
  const prefix = 'GET_ALL_ADMIN_TEMPLATES'
  return callBuilder(route, prefix)
}

export const createAdminTemplateAction = (emailState) => {
  const route = '/email/templates/admin'
  const prefix = 'CREATE_OR_UPDATE_ADMIN_TEMPLATE'
  return callBuilder(route, prefix, 'post', emailState)
}

export const deleteTemplateAction = (id) => {
  const route = `/email/templates/${id}`
  const prefix = 'DELETE_TEMPLATE'
  return callBuilder(route, prefix, 'delete')
}

const initialState = {
  pending: false,
  error: false,
  readyTemplate: { subject: '', body: '' },
  adminTemplates: [],
  createdId: false,
}

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
    case 'GET_ALL_ADMIN_TEMPLATES_SUCCESS':
      return {
        ...state,
        adminTemplates: action.response,
        pending: false,
        error: false,
      }
    case 'GET_ALL_ADMIN_TEMPLATES_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_ALL_ADMIN_TEMPLATES_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'CREATE_OR_UPDATE_ADMIN_TEMPLATE_SUCCESS':
      return {
        ...state,
        adminTemplates: action.response.createdId ? state.adminTemplates.concat(action.response.data) : state.adminTemplates.map((t) => {
          if (t.id === action.response.data.id) {
            return action.response.data
          }
          return t
        }),
        createdId: action.response.createdId,
        pending: false,
        error: false,
      }
    case 'CREATE_OR_UPDATE_ADMIN_TEMPLATE_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'CREATE_OR_UPDATE_ADMIN_TEMPLATE_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'DELETE_TEMPLATE_SUCCESS':
      return {
        ...state,
        adminTemplates: state.adminTemplates.filter(t => t.id !== action.response),
        pending: false,
        error: false,
      }
    case 'DELETE_TEMPLATE_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'DELETE_TEMPLATE_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
