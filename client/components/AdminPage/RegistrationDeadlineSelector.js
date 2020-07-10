import React from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { fi } from 'date-fns/locale'
import { Header, Message, List } from 'semantic-ui-react'

registerLocale('fi', fi)

export default function RegistrationDeadlineSelector({ newDeadlineDate, setNewDeadlineDate }) {
  const handleDeadlineUpdate = (date) => {
    const acualDl = new Date(date).setHours(23, 59, 59, 0)
    setNewDeadlineDate(acualDl)
  }

  return (
    <>
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
            Once the deadline passes (at 00:00 on the following day), student registrations are automatically closed.
          </List.Item>
        </List>
      </Message>
      <DatePicker data-cy="picker" minDate={new Date()} dateFormat="d.M.yyyy" locale="fi" placeholderText="Click to pick a date" selected={newDeadlineDate} onChange={date => handleDeadlineUpdate(date)} />
    </>
  )
}
