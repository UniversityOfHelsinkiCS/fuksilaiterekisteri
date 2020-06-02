import callBuilder from '../apiConnection'

export const sendEmail = (data) => {
  const route = '/send_email'
  const prefix = 'SEND_EMAIL'
  const method = 'post'
  return callBuilder(route, prefix, method, data)
}

const initialState = { pending: false }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SEND_EMAIL_ATTEMPT':
      return {
        pending: true,
      }
    case 'SEND_EMAIL_SUCCESS':
      return {
        pending: false,
      }
    case 'SEND_EMAIL_FAILURE':
      return {
        pending: false,
      }
    default:
      return state
  }
}
