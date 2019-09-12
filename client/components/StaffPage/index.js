import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Header, Segment } from 'semantic-ui-react'
import { getStudentsAction } from '../../util/redux/studentReducer'
import StudentTable from './StudentTable'
import StatsTable from '../StatsTable'

export default () => {
  const dispatch = useDispatch()
  const students = useSelector(state => state.student.students)
  const user = useSelector(state => state.user.data)

  useEffect(() => {
    dispatch(getStudentsAction())
  }, [])

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
      <StatsTable students={students} />
      <StudentTable students={students} />
    </div>
  )
}
