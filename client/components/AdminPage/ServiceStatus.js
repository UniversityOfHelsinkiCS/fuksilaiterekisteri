import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setServiceStatus } from 'Utilities/redux/serviceStatusReducer'
import {
  Button, Header, Segment, Message,
} from 'semantic-ui-react'
import RegistrationDeadlineSelector from './RegistrationDeadlineSelector'
import TaskDeadlineSelector from './TaskDeadlineSelector'
import CustomTexts from './CustomTexts'
import DeviceSerial from './DeviceSerial'
import StudyProgrammeContactDetails from './StudyProgrammeContactDetails'

export default function ServiceStatus() {
  const dispatch = useDispatch()
  const [settingsErrorMsg, setSettingsErrorMsg] = useState()
  const [newRegistrationDeadlineDate, setNewRegistrationDeadlineDate] = useState(undefined)
  const [newTaskDeadlineDate, setNewTaskDeadlineDate] = useState(undefined)
  const { pending, data: serviceStatus } = useSelector(state => state.serviceStatus)

  const currentTaskDeadline = useSelector(state => state.serviceStatus.data.taskDeadline)
  const currentRegistrationDeadline = useSelector(state => state.serviceStatus.data.registrationDeadline)


  if (!serviceStatus) return 'Loading serviceStatus'

  useEffect(() => {
    // Might have not been initialized.
    if (currentTaskDeadline) setNewTaskDeadlineDate(new Date(currentTaskDeadline))
    if (currentRegistrationDeadline) setNewRegistrationDeadlineDate(new Date(currentRegistrationDeadline))
  }, [currentTaskDeadline, currentRegistrationDeadline])

  useEffect(() => {
    if (currentRegistrationDeadline && currentTaskDeadline) {
      const now = new Date()
      const regDate = new Date(currentRegistrationDeadline)
      const taskDate = new Date(currentTaskDeadline)

      if (regDate > now && taskDate > now) {
        if (taskDate < regDate) {
          setSettingsErrorMsg('To enable registrations, distribution deadline must not be before the registration deadline.')
        } else {
          setSettingsErrorMsg(null)
        }
      } else {
        setSettingsErrorMsg('To enable registrations, registration and distribution deadlines must be set to future date.')
      }
    } else {
      setSettingsErrorMsg('To enable registrations, registration and distribution deadlines must be set.')
    }
  }, [currentRegistrationDeadline, currentTaskDeadline])

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
      disabled={pending || !!settingsErrorMsg}
    >
    Enable registrations
    </Button>
  )

  const StopServiceButton = () => (
    <Button
      data-cy="disableRegistrations"
      negative
      onClick={handleServiceStop}
      disabled={pending}
    >
    Disable registrations
    </Button>
  )

  const updateDeadlines = () => {
    const confirm = window.confirm('Update deadlines?')
    if (confirm) {
      dispatch(setServiceStatus({
        registrationDeadline: newRegistrationDeadlineDate,
        taskDeadline: newTaskDeadlineDate,
      }))
    }
  }

  const { studentRegistrationOnline, currentYear } = serviceStatus

  return (
    <div>
      <Segment>
        <Header as="h2">
          {`Registrations for year ${currentYear} are currently ${studentRegistrationOnline ? ' open' : ' closed'}`}
        </Header>
        {!studentRegistrationOnline && !!settingsErrorMsg && <Message negative>{settingsErrorMsg}</Message>}
        {studentRegistrationOnline ? <StopServiceButton /> : <StartServiceButton /> }
        <Button data-cy="endDistYear" disabled={studentRegistrationOnline || pending} onClick={handleFinishDistributionYear}>{`End distribution year ${currentYear}`}</Button>
        <RegistrationDeadlineSelector newDeadlineDate={newRegistrationDeadlineDate} setNewDeadlineDate={setNewRegistrationDeadlineDate} />
        <TaskDeadlineSelector newDeadlineDate={newTaskDeadlineDate} setNewDeadlineDate={setNewTaskDeadlineDate} />
        <div style={{ marginTop: '1em' }}><Button color="blue" onClick={updateDeadlines}>Update deadlines</Button></div>
      </Segment>
      <DeviceSerial />
      <CustomTexts />
      <StudyProgrammeContactDetails />
    </div>
  )
}
