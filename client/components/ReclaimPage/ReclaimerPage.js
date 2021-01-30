import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Segment, Message } from 'semantic-ui-react'
import { getReclaimCasesAction } from 'Utilities/redux/reclaimCaseReducer'
import { getAllReclaimerEmailTemplatesAction } from 'Utilities/redux/emailReducer'
import ReclaimTable from './ReclaimTable'
import ReclaimerFilter from './ReclaimerFilter'
import ReclaimerEmail from './ReclaimerEmail'
import ReclaimStatusFilter from './ReclaimStatusFilter'
import ReclaimSemesterFilter from './ReclaimSemesterFilter'

const ReclaimPage = () => {
  const dispatch = useDispatch()
  const [filter, setFilter] = useState('all')
  const [reclaimStatusFilter, setReclaimStatusFilter] = useState('OPEN')
  const [reclaimSemesterFilter, setReclaimSemesterFilter] = useState('all')
  const reclaimCases = useSelector(state => state.reclaimCases.data)

  useEffect(() => {
    dispatch(getReclaimCasesAction())
    dispatch(getAllReclaimerEmailTemplatesAction())
  }, [])

  const doFiltering = () => {
    let filtered
    switch (filter) {
      case 'all':
        filtered = reclaimCases
        break
      case 'fresherYearCredits':
        filtered = reclaimCases.filter(rc => rc.creditsUnderLimit)
        break
      case 'notPresent':
        filtered = reclaimCases.filter(rc => rc.absent)
        break
      case 'deviceReturnDeadlinePassed':
        filtered = reclaimCases.filter(rc => rc.loanExpired)
        break
      default:
        filtered = reclaimCases
        break
    }
    filtered = filtered
      .filter(rc => rc.status === reclaimStatusFilter)
      .filter(rc => reclaimSemesterFilter === 'all' || (reclaimSemesterFilter.includes(rc.year) && reclaimSemesterFilter.includes(rc.semester)))
    return { filteredCases: filtered }
  }

  const { filteredCases } = useMemo(doFiltering, [filter, reclaimCases, reclaimStatusFilter, reclaimSemesterFilter])

  return (
    <div className="tab-content" data-cy="reclaimerContent">
      <Message info>Student statuses are updated automatically twice a year. (15th of September and 31th of January)</Message>
      <Segment>
        <ReclaimerFilter filter={filter} setFilter={setFilter} totalCount={reclaimCases.length} filteredCount={filteredCases.length} />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <ReclaimSemesterFilter selected={reclaimSemesterFilter} setSelected={setReclaimSemesterFilter} />
          <ReclaimStatusFilter selected={reclaimStatusFilter} setSelected={setReclaimStatusFilter} />
          <ReclaimerEmail reclaimCases={filteredCases} />
        </div>
      </Segment>
      <ReclaimTable reclaimCases={filteredCases} />
    </div>
  )
}


export default ReclaimPage
