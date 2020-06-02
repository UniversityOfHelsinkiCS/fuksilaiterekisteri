import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import {
  Form, TextArea, Label, Button, Input, Accordion, Icon,
} from 'semantic-ui-react'
import { getUsersAction } from '../../../util/redux/usersReducer'
import { callApi } from '../../../util/apiConnection'

const Filter = ({
  attribute,
  label,
  attributeValue,
  handleClick,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '2em' }}>
    <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
    <Button.Group compact style={{ alignSelf: 'flex-start' }}>
      <Button toggle active={attributeValue} onClick={() => handleClick(attribute, true)}>
        Yes
      </Button>
      <Button.Or />
      <Button
        toggle
        active={attributeValue === false}
        onClick={() => handleClick(attribute, false)}
      >
        No
      </Button>
    </Button.Group>
  </div>
)

const EmailView = () => {
  const [recipientEmails, setRecipientEmails] = useState([])
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState('')
  const [showingEmails, setShowingEmails] = useState(false)
  const [filters, setFilters] = useState({
    eligible: null,
    digiSkillsCompleted: null,
    wantsDevice: null,
    courseRegistrationCompleted: null,
  })

  const students = useSelector(state => state.users.data.filter(user => user.studentNumber), shallowEqual)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUsersAction())
  }, [])

  useEffect(() => {
    const filteredStudentsEmails = students
      .filter(user => (
        !Object.entries(filters).find(([key, value]) => (
          user[key] !== value && value !== null))))
      .reduce((emails, student) => {
        emails.push(student.hyEmail)
        if (students.personalEmail) emails.push(student.personalEmail)
        return emails
      }, [])

    setRecipientEmails(filteredStudentsEmails)
  }, [filters, students])

  const handleFilterClick = (attribute, value) => {
    if (value === filters[attribute]) setFilters({ ...filters, [attribute]: null })
    else setFilters({ ...filters, [attribute]: value })
  }

  const handleTitleChange = (e) => {
    setSubject(e.target.value)
  }

  const handleMessageChange = (e) => {
    setText(e.target.value)
  }

  const handleReplyToChange = (e) => {
    setReplyTo(e.target.value)
  }

  const handleAccordionClick = () => {
    setShowingEmails(!showingEmails)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = {
      recipientEmails,
      subject,
      text,
      replyTo,
    }
    callApi('/send_email', 'post', data)
  }

  return (
    <div style={{ width: '100%', maxWidth: '1024px' }}>
      <div
        style={{
          display: 'flex',
          marginLeft: '-2em',
          paddingBottom: '1em',
          flexWrap: 'wrap',
        }}
      >
        <Filter
          attribute="eligible"
          attributeValue={filters.eligible}
          label="Eligible"
          handleClick={handleFilterClick}
        />
        <Filter
          attribute="wantsDevice"
          attributeValue={filters.wantsDevice}
          label="Wants device"
          handleClick={handleFilterClick}
        />
        <Filter
          attribute="digiSkillsCompleted"
          attributeValue={filters.digiSkillsCompleted}
          label="Digi Skills completed"
          handleClick={handleFilterClick}
        />
        <Filter
          attribute="courseRegistrationCompleted"
          attributeValue={filters.courseRegistrationCompleted}
          label="Course registration"
          handleClick={handleFilterClick}
        />
      </div>
      <Accordion styled fluid>
        <Accordion.Title active={showingEmails} onClick={handleAccordionClick}>
          <Icon name="dropdown" />
          {`${recipientEmails.length} emails selected`}
        </Accordion.Title>
        <Accordion.Content active={showingEmails}>
          {recipientEmails.map(email => <Label key={email}>{email}</Label>)}
        </Accordion.Content>
      </Accordion>
      <Form onSubmit={handleSubmit} style={{ paddingTop: '1em' }}>
        <Input type="email" fluid placeholder="Reply to (Optional)" value={replyTo} onChange={handleReplyToChange} />
        <Input required fluid placeholder="Subject" value={subject} onChange={handleTitleChange} />
        <TextArea rows={10} required placeholder="Text" value={text} onChange={handleMessageChange} />
        <Button type="submit" primary disabled={recipientEmails.length === 0} style={{ marginTop: '0.5em' }}>Send</Button>
      </Form>
    </div>
  )
}

export default EmailView
