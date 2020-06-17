import React from 'react'
import { useSelector } from 'react-redux'
import RequestDeviceForm from './RequestDeviceForm'
import TaskStatus from './TaskStatus'
import DeviceInfo from './DeviceInfo'
import NotEligible from './NotEligible'

const StudentPage = () => {
  const user = useSelector(state => state.user.data)
  const getContent = () => {
    if (!user) return null
    if (user.deviceSerial) return <DeviceInfo />
    if (!user.eligible) return <NotEligible user={user} />
    if (!user.wantsDevice) return <RequestDeviceForm />
    return <TaskStatus />
  }

  return (
    <div style={{ alignSelf: 'center' }}>
      { getContent() }
    </div>
  )
}

export default StudentPage
