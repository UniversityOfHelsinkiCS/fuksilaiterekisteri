import React from 'react'
import { useSelector } from 'react-redux'
import NotEligible from './NotEligible'
import RequestDeviceForm from './RequestDeviceForm'
import StudentStatusPage from './StudentStatusPage'

const StudentPage = () => {
  const user = useSelector(state => state.user)

  if (!user.data.eligible) return <NotEligible />
  if (!user.data.wantsDevice) return <RequestDeviceForm />
  return <StudentStatusPage />
}

export default StudentPage
