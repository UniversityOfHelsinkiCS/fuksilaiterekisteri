import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Header, Segment } from 'semantic-ui-react'
import { getStudentsAction } from '../../util/redux/studentReducer'
import StudentTable from './StudentTable'
import StatsTable from '../StatsTable'
import StaffFilter from './StaffFilter'

export default () => {
  const dispatch = useDispatch()
  const students = useSelector(state => state.student.students)
  const user = useSelector(state => state.user.data)
  const settings = useSelector(state => state.serviceStatus.data)

  useEffect(() => {
    dispatch(getStudentsAction())
  }, [])

  const [filter, setFilter] = useState('all')

  const doFiltering = () => {
    let filtered
    let hiddenColumns = []
    switch (filter) {
      case 'all':
        filtered = students
        break
      case 'deviceHolders':
        filtered = students.filter(u => !!u.deviceGivenAt && !u.deviceReturned)
        hiddenColumns = ['eligible', 'wants_device', 'digitaidot', 'enrolled']
        break
      case 'currentYearEligible':
        filtered = students.filter(u => u.signupYear === settings.currentYear && u.eligible)
        hiddenColumns = ['eligible', 'mark_eligible']
        break
      default:
        filtered = students
        break
    }
    return { filtered, hiddenColumns }
  }

  const { filtered: filteredStudents, hiddenColumns } = useMemo(doFiltering, [filter, students])

  return (
    <div style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
      <Segment>
        <Header as="h3">
          Sinulla on oikeus seuraaviin opinto-ohjelmiin:
          <ul>
            {user.studyPrograms.map(s => <li key={s.code}>{`${s.name} (${s.code})`}</li>)}
          </ul>
        </Header>
      </Segment>
      <StatsTable students={filteredStudents} />
      <StaffFilter filter={filter} setFilter={setFilter} totalCount={students.length} filteredCount={filteredStudents.length} />
      <StudentTable hiddenColumns={hiddenColumns} students={filteredStudents} />
    </div>
  )
}
