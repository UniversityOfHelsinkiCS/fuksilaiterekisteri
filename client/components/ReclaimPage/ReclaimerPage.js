import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Segment, Message } from 'semantic-ui-react'
import { getStudentsWithReclaimStatus } from 'Utilities/redux/studentReducer'
import { getAllReclaimerEmailTemplatesAction } from 'Utilities/redux/emailReducer'
import ReclaimTable from './ReclaimTable'
import ReclaimerFilter from './ReclaimerFilter'
import ReclaimerEmail from './ReclaimerEmail'
import ReclaimStatusFilter from './ReclaimStatusFilter'

const ReclaimPage = () => {
  const dispatch = useDispatch()
  const [filter, setFilter] = useState('all')
  const [reclaimStatusFilter, setReclaimStatusFilter] = useState('OPEN')
  const students = useSelector(state => state.student.students)

  useEffect(() => {
    dispatch(getStudentsWithReclaimStatus())
    dispatch(getAllReclaimerEmailTemplatesAction())
  }, [])

  const doFiltering = () => {
    let filtered
    switch (filter) {
      case 'all':
        filtered = students
        break
      case 'fresherYearCredits':
        filtered = students.filter(u => u.firstYearCredits < 30 && !u.thirdYearOrLaterStudent)
        break
      case 'notPresent':
        filtered = students.filter(u => !u.present)
        break
      case 'deviceReturnDeadlinePassed':
        filtered = students.filter(u => u.deviceReturnDeadlinePassed)
        break
      default:
        filtered = students
        break
    }
    filtered = filtered.filter(student => student.reclaimStatus === reclaimStatusFilter)
    return { filteredStudents: filtered }
  }

  const { filteredStudents } = useMemo(doFiltering, [filter, students, reclaimStatusFilter])

  return (
    <div className="tab-content" data-cy="reclaimerContent">
      <Message info>Student statuses are updated automatically twice a year. (15th of September and 31th of January)</Message>
      <Segment>
        <ReclaimerFilter filter={filter} setFilter={setFilter} totalCount={students.length} filteredCount={filteredStudents.length} />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <ReclaimStatusFilter selected={reclaimStatusFilter} setSelected={setReclaimStatusFilter} />
          <ReclaimerEmail students={filteredStudents} />
        </div>
      </Segment>
      <ReclaimTable students={filteredStudents} />
    </div>
  )
}


export default ReclaimPage
