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
    default:
      return state
  }
}
