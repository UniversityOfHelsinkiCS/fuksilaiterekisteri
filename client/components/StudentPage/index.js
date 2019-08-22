import React from 'react'
import { useSelector } from 'react-redux'
import NotEligible from './NotEligible'
import RequestDeviceForm from './RequestDeviceForm'
import StudentStatusPage from './StudentStatusPage'
import DeviceInfo from './DeviceInfo'

const StudentPage = () => {
  const user = useSelector(state => state.user.data)
  if (!user) return null
  if (user.deviceSerial) return <DeviceInfo />
  if (!user.eligible) return <NotEligible />
  if (!user.wantsDevice) return <RequestDeviceForm />
  return <StudentStatusPage />
}

export default StudentPage
