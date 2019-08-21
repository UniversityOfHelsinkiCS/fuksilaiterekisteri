import axios from 'axios'
import { getHeaders } from 'Utilities/fakeShibboleth'
import { basePath } from 'Utilities/common'

/**
 * ApiConnection simplifies redux usage
 */

const getAxios = axios.create({ baseURL: `${basePath}api` })

const callApi = async (url, method = 'get', data) => {
  const headers = { ...getHeaders() }
  return getAxios({
    method,
    url,
    data,
    headers,
  })
}

export default (route, prefix, method = 'get', data, query) => (
  {
    type: `${prefix}_ATTEMPT`,
    requestSettings: {
      route,
      method,
      data,
      prefix,
      query,
    },
  }
)

/**
 * This is a redux middleware used for tracking api calls
 */

export const handleRequest = store => next => async (action) => {
  next(action)
  const { requestSettings } = action
  if (requestSettings) {
    const {
      route, method, data, prefix, query,
    } = requestSettings
    try {
      const res = await callApi(route, method, data)
      store.dispatch({ type: `${prefix}_SUCCESS`, response: res.data, query })
    } catch (err) {
      store.dispatch({ type: `${prefix}_FAILURE`, response: err, query })
    }
  }
}
