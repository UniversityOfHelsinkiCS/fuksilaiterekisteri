import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStudentsAction } from '../../util/redux/studentReducer'
import StudentTable from './StudentTable'

export default () => {
  const dispatch = useDispatch()
  const students = useSelector(state => state.student.students)

  useEffect(() => {
    dispatch(getStudentsAction())
  }, [])

  return (
    <div style={{ maxWidth: '100%' }}>
      <h1>Hei, olet työntekijä</h1>
      <StudentTable students={students} />
    </div>
  )
}
