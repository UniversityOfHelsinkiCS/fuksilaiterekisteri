import React from 'react'
import { useSelector } from 'react-redux'
import TranslatedText from 'Components/TranslatedText'
import RequestDeviceForm from './RequestDeviceForm'
import TaskStatus from './TaskStatus'
import DeviceInfo from './DeviceInfo'

const StudentPage = () => {
  const user = useSelector(state => state.user.data)
  const getContent = () => {
    if (!user) return null
    if (user.deviceSerial) return <DeviceInfo />
    if (!user.eligible) return <TranslatedText textKey="notEligible" />
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
