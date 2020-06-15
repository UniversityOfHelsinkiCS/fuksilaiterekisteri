import React, { useState, useEffect } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { fi } from 'date-fns/locale'
import {
  Button, Header, Segment, Message, List,
} from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { setServiceStatus } from 'Utilities/redux/serviceStatusReducer'

registerLocale('fi', fi)

export default function DeadlineSelector() {
  const dispatch = useDispatch()
  const [newDeadlineDate, setNewDeadlineDate] = useState(undefined)
  const currentDeadline = useSelector(state => state.serviceStatus.data.registrationDeadline)

  useEffect(() => {
    // Might have not been initialized.
    if (currentDeadline) setNewDeadlineDate(new Date(currentDeadline))
  }, [currentDeadline])

  const handleDeadlineUpdate = () => {
    const confirm = window.confirm('Update deadline?')

    if (confirm) {
      const acualDl = new Date(newDeadlineDate).setHours(23, 59, 59, 0)
      dispatch(setServiceStatus({ registrationDeadline: acualDl }))
    }
  }

  return (
    <Segment>
      <Header as="h2">Registration deadline</Header>
      <Message>
        <List bulleted>
          <List.Item>
            This deadline is used to determine if student has registered for a device in time.
          </List.Item>
          <List.Item>
            Students who have not registered in time, will not be eligible for a device.
          </List.Item>
          <List.Item>
            The deadline also affects whether or not the system will try to update students on an hourly basis.
          </List.Item>
          <List.Item>
            Once the deadline passes (at 00:00 on the following day), student registrations are automatically closed.
          </List.Item>
        </List>
      </Message>
      <DatePicker data-cy="picker" minDate={new Date()} dateFormat="d.M.yyyy" locale="fi" placeholderText="Click to pick a date" selected={newDeadlineDate} onChange={date => setNewDeadlineDate(date)} />
      <Button data-cy="updateDeadline" style={{ marginLeft: '1em' }} onClick={handleDeadlineUpdate}>Update deadline</Button>
    </Segment>
  )
}
