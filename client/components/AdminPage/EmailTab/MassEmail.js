import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Form, TextArea, Label, Button, Input, Accordion, Icon, Loader, Select, Dropdown,
} from 'semantic-ui-react'
import { getUsersAction } from 'Utilities/redux/usersReducer'
import { sendEmail } from 'Utilities/redux/emailReducer'
import EmailConfirmation from './EmailConfirmation'

const Filter = ({
  attribute,
  label,
  attributeValue,
  handleClick,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '2em',
      paddingBottom: '1em',
    }}
  >
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

const DropdownFilter = ({
  label,
  value,
  onChange,
  placeholder,
  options,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '2em' }}>
    <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
    <Dropdown placeholder={placeholder} options={options} value={value} onChange={onChange} selection clearable multiple fluid />
  </div>
)

const MassEmail = () => {
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [recipientEmails, setRecipientEmails] = useState([])
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState('')
  const [showingEmails, setShowingEmails] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const [filters, setFilters] = useState({
    eligible: null,
    digiSkillsCompleted: null,
    wantsDevice: null,
    courseRegistrationCompleted: null,
    hasDevice: null,
    signedUpForDeviceThisYear: null,
    deviceGivenAt: [],
  })

  const users = useSelector(state => state.users.data)
  const students = useMemo(() => users.filter(user => user.studentNumber), [users])
  const { pending: emailPending, adminTemplates } = useSelector(state => state.email)
  const settings = useSelector(state => state.serviceStatus.data)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUsersAction())
  }, [])

  useEffect(() => {
    const filteredStudentsEmails = students
      .filter(user => (
        !Object.entries(filters).find(([filterName, filterValue]) => {
          if (filterValue === null) return false

          if (filterName === 'hasDevice') {
            return (!!user.deviceGivenAt && !user.deviceReturned) !== filterValue
          }

          if (filterName === 'signedUpForDeviceThisYear') {
            return (user.signupYear === settings.currentYear) !== filterValue
          }

          if (filterName === 'deviceGivenAt') {
            return filterValue.length > 0 && !filterValue.includes(new Date(user.deviceGivenAt).getFullYear())
          }

          return user[filterName] !== filterValue
        })))
      .reduce((emails, student) => {
        emails.push(student.hyEmail)
        if (students.personalEmail) emails.push(student.personalEmail)
        return emails
      }, [])

    setRecipientEmails(filteredStudentsEmails)
  }, [filters, students])

  const templateOptions = useMemo(() => {
    const temp = adminTemplates.map(({ id, description }) => ({
      key: id,
      value: id,
      text: description,
    }))

    return temp
  }, [adminTemplates])

  const deviceGivenOptions = useMemo(() => {
    const uniqueYears = Array.from(new Set(students
      .filter(student => student.deviceGivenAt)
      .map(studentWithDevice => new Date(studentWithDevice.deviceGivenAt).getFullYear()))).sort()
    const options = uniqueYears.map(year => ({ key: year, value: year, text: year }))
    return options
  }, [students])

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

  const handleSendClick = () => {
    setConfirmationOpen(false)

    const data = {
      recipientEmails,
      subject,
      text,
      replyTo,
    }

    dispatch(sendEmail(data))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setConfirmationOpen(true)
  }

  const handleTemplateSelect = (_e, { value }) => {
    const {
      id, subject: newSubject, replyTo: newReplyTo, body: newBody,
    } = adminTemplates.find(p => p.id === value)
    setSelectedTemplateId(id)
    setSubject(newSubject)
    setReplyTo(newReplyTo)
    setText(newBody)
  }

  return (
    <div style={{ width: '100%', maxWidth: '1024px' }}>
      <Loader active={emailPending} />
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
        <Filter
          attribute="hasDevice"
          attributeValue={filters.hasDevice}
          label="Holds device"
          handleClick={handleFilterClick}
        />
        <Filter
          attribute="signedUpForDeviceThisYear"
          attributeValue={filters.signedUpForDeviceThisYear}
          label={`Signed up for device in ${settings.currentYear}`}
          handleClick={handleFilterClick}
        />
        <DropdownFilter
          label="Device given at"
          options={deviceGivenOptions}
          value={filters.deviceGivenAt}
          onChange={(e, { value }) => setFilters({ ...filters, deviceGivenAt: value })}
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
      <Select disabled={!templateOptions.length} data-cy="selectTemplate" value={selectedTemplateId} onChange={handleTemplateSelect} style={{ width: '100%', margin: '1em 0em' }} placeholder="Select a template to use it" options={templateOptions} />
      <Form onSubmit={handleSubmit} style={{ paddingTop: '1em' }}>
        <Input name="replyTo" type="email" fluid placeholder="Optional" value={replyTo} onChange={handleReplyToChange} label="ReplyTo" labelPosition="left corner" />
        <Input name="subject" required fluid placeholder="Enter subject.." value={subject} onChange={handleTitleChange} label="Subject" labelPosition="left corner" />
        <TextArea name="text" rows={10} required placeholder="Enter text.." value={text} onChange={handleMessageChange} />
        <Button
          primary
          type="submit"
          disabled={recipientEmails.length === 0 || emailPending}
          style={{ marginTop: '0.5em' }}
        >
          Send
        </Button>
      </Form>
      <EmailConfirmation
        open={confirmationOpen}
        handleClose={() => setConfirmationOpen(false)}
        handleSend={handleSendClick}
        emailAmount={recipientEmails.length}
      />
    </div>
  )
}

export default MassEmail
