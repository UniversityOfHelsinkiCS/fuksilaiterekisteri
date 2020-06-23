import React, { useState, useEffect } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { fi } from 'date-fns/locale'
import {
  Button, Header, Segment, Message, List,
} from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { setServiceStatus } from 'Utilities/redux/serviceStatusReducer'

registerLocale('fi', fi)

export default function TaskDeadlineSelector() {
  const dispatch = useDispatch()
  const [newDeadlineDate, setNewDeadlineDate] = useState(undefined)
  const currentDeadline = useSelector(state => state.serviceStatus.data.taskDeadline)

  useEffect(() => {
    // Might have not been initialized.
    if (currentDeadline) setNewDeadlineDate(new Date(currentDeadline))
  }, [currentDeadline])

  const handleDeadlineUpdate = () => {
    const confirm = window.confirm('Update deadline?')

    if (confirm) {
      const acualDl = new Date(newDeadlineDate).setHours(23, 59, 59, 0)
      dispatch(setServiceStatus({ taskDeadline: acualDl }))
    }
  }

  return (
    <Segment>
      <Header as="h2">Distribution deadline</Header>
      <Message>
        <List bulleted>
          <List.Item>
            This deadline is for the last possible date for a device pick up.
          </List.Item>
          <List.Item>
            The deadline also affects whether or not the system will try to update students on an hourly basis.
          </List.Item>
          <List.Item>
            Once the deadline passes (at 00:00 on the following day), students completed tasks are no longer updated.
          </List.Item>
        </List>
      </Message>
      <DatePicker minDate={new Date()} dateFormat="d.M.yyyy" locale="fi" placeholderText="Click to pick a date" selected={newDeadlineDate} onChange={date => setNewDeadlineDate(date)} />
      <Button data-cy="updateTaskDeadline" style={{ marginLeft: '1em' }} onClick={handleDeadlineUpdate}>Update deadline</Button>
    </Segment>
  )
}
