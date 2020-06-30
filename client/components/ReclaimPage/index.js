import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { getStudentsWithOpenReclaimStatus, updateStudentReclainmStatuses } from 'Utilities/redux/studentReducer'
import ReclaimTable from './ReclaimTable'
import ReclaimerFilter from './ReclaimerFilter'

const ReclaimPage = () => {
  const dispatch = useDispatch()
  const [filter, setFilter] = useState('all')

  const students = useSelector(state => state.student.students)

  useEffect(() => {
    dispatch(getStudentsWithOpenReclaimStatus())
  }, [])

  const handleUpdateClick = () => {
    dispatch(updateStudentReclainmStatuses())
  }

  const doFiltering = () => {
    let filtered
    switch (filter) {
      case 'all':
        filtered = students
        break
      case 'fresherYearCredits':
        filtered = students.filter(u => u.firstYearCredits < 30)
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
    return { filteredStudents: filtered }
  }

  const { filteredStudents } = useMemo(doFiltering, [filter, students])

  return (
    <div style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column' }} data-cy="reclaimerContent">
      <Button onClick={handleUpdateClick} style={{ marginBottom: '1em' }} data-cy="updateReclaimStatuses">
        Run student status updater
      </Button>
      <ReclaimerFilter filter={filter} setFilter={setFilter} totalCount={students.length} filteredCount={filteredStudents.length} />
      <ReclaimTable students={filteredStudents} />
    </div>
  )
}

export default ReclaimPage
