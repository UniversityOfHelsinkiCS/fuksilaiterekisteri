import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Header, Segment } from 'semantic-ui-react'
import { getStudentsAction } from '../../util/redux/studentReducer'
import StudentTable from './StudentTable'

export default () => {
  const dispatch = useDispatch()
  const students = useSelector(state => state.student.students)
  const user = useSelector(state => state.user.data)

  useEffect(() => {
    dispatch(getStudentsAction())
  }, [])

  return (
    <div style={{ maxWidth: '100%' }}>
      <Segment>
        <Header as="h3">
          Sinulla on oikeus seuraaviin opinto-ohjelmiin:
          <ul>
            {user.studyPrograms.map(s => <li key={s.code}>{`${s.name} (${s.code})`}</li>)}
          </ul>
        </Header>
      </Segment>
      <StudentTable students={students} />
    </div>
  )
}
