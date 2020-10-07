const initialState = { error: null, success: null }

export const clearNotification = () => ({ type: 'CLEAR_NOTIFICATION' })

export const setErrorNotfication = message => ({ type: 'SET_ERROR_NOTIFICATION', message })

export const setSuccessNotification = message => ({ type: 'SET_SUCCESS_NOTIFICATION', message })

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CLEAR_NOTIFICATION':
      return initialState
    case 'SET_ERROR_NOTIFICATION':
      return {
        ...state,
        error: action.message,
      }
    case 'SET_SUCCESS_NOTIFICATION':
      return {
        ...state,
        success: action.message,
      }
    case 'SEND_EMAIL_SUCCESS':
      return {
        ...state,
        success: 'Emails sent successfully',
      }
    case 'SEND_EMAIL_FAILURE':
      return {
        ...state,
        error: 'There was an error trying to send the emails',
      }
    case 'UPDATE_READY_TEMPLATE_SUCCESS':
      return {
        ...state,
        success: 'Email template updated',
      }
    case 'UPDATE_READY_TEMPLATE_FAILURE':
      return {
        ...state,
        error: 'Failed to update email template',
      }
    case 'SET_SERVICE_STATUS_SUCCESS':
      return {
        ...state,
        success: 'Settings saved',
      }
    case 'SET_SERVICE_STATUS_FAILURE':
      return {
        ...state,
        error: 'Error while saving settings',
      }
    case 'UPDATE_STUDYPROGRAMMES_SUCCESS':
      return {
        ...state,
        success: 'Settings saved',
      }
    case 'UPDATE_STUDYPROGRAMMES_FAILURE':
      return {
        ...state,
        error: 'Error while saving settings',
      }
    case 'CREATE_OR_UPDATE_ADMIN_TEMPLATE_SUCCESS':
      return {
        ...state,
        success: 'Email template saved.',
      }
    case 'CREATE_OR_UPDATE_ADMIN_TEMPLATE_FAILURE':
      return {
        ...state,
        error: 'Error while saving email template.',
      }
    case 'DELETE_TEMPLATE_SUCCESS':
      return {
        ...state,
        success: 'Email template deleted.',
      }
    case 'DELETE_TEMPLATE_FAILURE':
      return {
        ...state,
        error: 'Error while deleting email template.',
      }
    case 'DELETE_RECLAIMER_TEMPLATE_SUCCESS':
      return {
        ...state,
        success: 'Email template deleted.',
      }
    case 'DELETE_RECLAIMER_TEMPLATE_FAILURE':
      return {
        ...state,
        error: 'Error while deleting email template.',
      }
    case 'CREATE_OR_UPDATE_RECLAIMER_TEMPLATE_SUCCESS':
      return {
        ...state,
        success: 'Email template saved.',
      }
    case 'CREATE_OR_UPDATE_RECLAIMER_TEMPLATE_FAILURE':
      return {
        ...state,
        error: 'Error while saving email template.',
      }
    case 'UPDATE_USER_STUDY_PROGRAMS_SUCCESS':
      return {
        ...state,
        success: 'Users study program rights updated',
      }
    case 'UPDATE_USER_STUDY_PROGRAMS_FAILURE':
      return {
        ...state,
        error: 'Error while saving users study program rights',
      }
    case 'UPDATE_STUDENT_SERIAL_SUCCESS':
      return {
        ...state,
        success: 'Serial updated',
      }
    case 'UPDATE_STUDENT_SERIAL_FAILURE':
      return {
        ...state,
        error: 'Serial update failed',
      }
    default:
      return state
  }
}
