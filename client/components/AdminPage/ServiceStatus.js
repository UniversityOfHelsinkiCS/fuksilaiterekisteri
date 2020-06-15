import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getServiceStatus, setServiceStatus } from 'Utilities/redux/serviceStatusReducer'
import {
  Button, Header, Segment,
} from 'semantic-ui-react'
import DeadlineSelector from './DeadlineSelector'
import CustomTexts from './CustomTexts'

export default function ServiceStatus() {
  const dispatch = useDispatch()
  const serviceStatus = useSelector(state => state.serviceStatus.data)

  useEffect(() => {
    dispatch(getServiceStatus())
  }, [])

  if (!serviceStatus) return 'Loading serviceStatus'

  const incorrectConfirmation = () => {
    alert('Incorrect confirmation.')
  }

  const handleServiceStop = () => {
    // eslint-disable-next-line no-alert
    const response = window.prompt('This prevents new registrations from students. Are you sure you want to do this? Type "stop" to confirm.')
    if (response === 'stop') {
      dispatch(setServiceStatus({
        ...serviceStatus,
        studentRegistrationOnline: false,
      }))
    } else {
      incorrectConfirmation()
    }
  }

  const handleServiceStart = () => {
    // eslint-disable-next-line no-alert
    const response = window.prompt('This will allow new students to register and request a device. Make sure to also update this year\'s registration deadline. Type "start" to confirm.')
    if (response === 'start') {
      dispatch(setServiceStatus({
        ...serviceStatus,
        studentRegistrationOnline: true,
      }))
    } else {
      incorrectConfirmation()
    }
  }

  const handleFinishDistributionYear = () => {
    // eslint-disable-next-line no-alert
    const response = window.prompt(`This action ends distribution year ${serviceStatus.currentYear}. Doing this advances the year to ${serviceStatus.currentYear + 1}, are you sure you want to do this? Type "advance" to confirm.`)
    if (response === 'advance') {
      dispatch(setServiceStatus({
        ...serviceStatus,
        studentRegistrationOnline: false,
        currentYear: serviceStatus.currentYear + 1,
        currentSemester: serviceStatus.currentSemester + 2, // Fall term of next year.
      }))
    } else {
      incorrectConfirmation()
    }
  }

  const StartServiceButton = () => (
    <Button
      data-cy="enableRegistrations"
      positive
      onClick={handleServiceStart}
    >
    Enable registrations
    </Button>
  )

  const StopServiceButton = () => (
    <Button
      data-cy="disableRegistrations"
      negative
      onClick={handleServiceStop}
    >
    Disable registrations
    </Button>
  )


  const { studentRegistrationOnline, currentYear } = serviceStatus


  return (
    <div>
      <Segment>
        <Header as="h2">
          {`Registrations for year ${currentYear} are currently ${studentRegistrationOnline ? ' open' : ' closed'}`}
        </Header>
        {studentRegistrationOnline ? <StopServiceButton /> : <StartServiceButton /> }
        <Button data-cy="endDistYear" disabled={studentRegistrationOnline} onClick={handleFinishDistributionYear}>{`End distribution year ${currentYear}`}</Button>
      </Segment>
      <DeadlineSelector />

      <CustomTexts />

    </div>
  )
}
