import React from 'react'
import { useSelector } from 'react-redux'
import RequestDeviceForm from './RequestDeviceForm'
import TaskStatus from './TaskStatus'
import DeviceInfo from './DeviceInfo'
import NotEligible from './NotEligible'
import ExtendedRequestDeviceForm from './ExtendedRequestDeviceForm'
import ExtendedTaskStatus from './ExtendedTaskStatus'

const StudentPage = () => {
  const user = useSelector(state => state.user.data)
  const currentYear = useSelector(state => state.serviceStatus.data.currentYear)
  const getContent = () => {
    const notCurrentYearsFuksi = user.signupYear !== currentYear

    if (!user) return null
    if (user.deviceSerial) return <DeviceInfo />
    if (user.extendedEligible && !user.extendedWantsDevice) return <ExtendedRequestDeviceForm />
    if (user.extendedEligible) return <ExtendedTaskStatus />
    if (!user.eligible || notCurrentYearsFuksi) return <NotEligible user={user} notCurrentYearsFuksi={notCurrentYearsFuksi} />
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
