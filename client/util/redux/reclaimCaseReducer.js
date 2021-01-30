import callBuilder from '../apiConnection'

export const getReclaimCasesAction = () => {
  const route = '/reclaim_case'
  const prefix = 'GET_RECLAIM_CASES'
  return callBuilder(route, prefix)
}

export const updateReclaimCaseStatusAction = (status, reclaimCaseId) => {
  const route = `/reclaim_case/${reclaimCaseId}/status`
  const prefix = 'UPDATE_RECLAIM_CASE_STATUS'
  const method = 'post'
  const data = { status }
  return callBuilder(route, prefix, method, data)
}

const handleCaseUpdate = (updatedCase, data) => data.map(reclaimCase => (reclaimCase.id === updatedCase.id ? updatedCase : reclaimCase))

export default (state = { data: [] }, action) => {
  switch (action.type) {
    case 'GET_RECLAIM_CASES_SUCCESS':
      return {
        ...state,
        data: action.response,
      }
    case 'UPDATE_RECLAIM_CASE_STATUS_SUCCESS':
      return {
        ...state,
        data: handleCaseUpdate(action.response, state.data),
      }
    default:
      return state
  }
}
