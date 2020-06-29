import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { getStudentsWithOpenReclaimStatus, updateStudentReclainmStatuses } from 'Utilities/redux/studentReducer'
import ReclaimTable from './ReclaimTable'

const ReclaimPage = () => {
  const dispatch = useDispatch()

  const students = useSelector(state => state.student.students)

  useEffect(() => {
    dispatch(getStudentsWithOpenReclaimStatus())
  }, [])

  const handleUpdateClick = () => {
    dispatch(updateStudentReclainmStatuses())
  }

  return (
    <div style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
      <Button onClick={handleUpdateClick} style={{ marginBottom: '1em' }}>Run student status updater</Button>
      <ReclaimTable students={students} />
    </div>
  )
}

export default ReclaimPage
