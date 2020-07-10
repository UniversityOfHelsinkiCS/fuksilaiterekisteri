import React from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { fi } from 'date-fns/locale'
import { Header, Message, List } from 'semantic-ui-react'

registerLocale('fi', fi)

export default function TaskDeadlineSelector({ newDeadlineDate, setNewDeadlineDate }) {
  const handleDeadlineUpdate = (date) => {
    const acualDl = new Date(date).setHours(23, 59, 59, 0)
    setNewDeadlineDate(acualDl)
  }

  return (
    <>
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
      <DatePicker minDate={new Date()} dateFormat="d.M.yyyy" locale="fi" placeholderText="Click to pick a date" selected={newDeadlineDate} onChange={date => handleDeadlineUpdate(date)} />
    </>
  )
}
