import React, { useState, useEffect, useMemo } from 'react'
import {
  Button, Modal, Form, Input, TextArea, Accordion, Icon, Label, Message, Select,
} from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { callApi } from 'Utilities/apiConnection'
import { getStudentsWithReclaimStatus } from 'Utilities/redux/studentReducer'

export default function ReclaimerEmail({ students }) {
  const dispatch = useDispatch()
  const [formState, setFormState] = useState({
    replyTo: '',
    subject: '',
    text: '',
  })

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [pending, setPending] = useState(false)
  const [rejectedEmails, setRejectedEmails] = useState([])
  const [acceptedEmails, setAcceptedEmails] = useState([])
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)

  const reclaimerTemplates = useSelector(state => state.email.reclaimerTemplates)
  const [showingEmails, setShowingEmails] = useState(false)
  const [names, setNames] = useState([])

  const handleSubmit = (event) => {
    event.preventDefault()
    const confirm = window.confirm(`The email will be sent to ${students.length} students IMMEDIATELY. Are you sure?`)
    if (!confirm) return

    setPending(true)
    callApi('/email/reclaimer/send', 'POST', { ...formState, userIds: students.map(s => s.userId) })
      .then((res) => {
        setPending(false)
        setError(false)

        const { accepted, rejected } = res.data
        setAcceptedEmails(accepted)
        setRejectedEmails(rejected)
        dispatch(getStudentsWithReclaimStatus()) // Just get a new list with updated reclaimStatuses

        setFormState({
          replyTo: '',
          subject: '',
          text: '',
        })
      })
      .catch((e) => {
        setPending(false)
        setError(true)
        const msg = e && e.response && e.response.data && e.response.data.error
        setErrorMessage(`Something went wrong while trying to send the emails, please contact Toska immediately! ${msg}`)
      })
  }

  useEffect(() => {
    setNames(students.map(({ name }) => name))
  }, [students])

  const templateOptions = useMemo(() => {
    const temp = reclaimerTemplates.map(({ id, description }) => ({
      key: id,
      value: id,
      text: description,
    }))

    return temp
  }, [reclaimerTemplates])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState({
      ...formState,
      [name]: value,
    })
  }

  const handleTemplateSelect = (_e, { value }) => {
    const {
      id, subject: newSubject, replyTo: newReplyTo, body: newBody,
    } = reclaimerTemplates.find(p => p.id === value)
    setSelectedTemplateId(id)
    setFormState({
      replyTo: newReplyTo,
      subject: newSubject,
      text: newBody,
    })
  }

  const EmailStatus = () => (
    <>
      <div>
        {error && <Message negative>{errorMessage}</Message>}
      </div>
      <div>
        {!!acceptedEmails.length && (
          <Message positive>{`Email successfully sent to ${acceptedEmails.join(', ')}`}</Message>
        )}
      </div>
      <div>
        {!!rejectedEmails.length && (
        <Message negative>{`These email addresses were rejected ${rejectedEmails.join(', ')}`}</Message>
        )}
      </div>
    </>
  )

  const { replyTo, subject, text } = formState
  return (
    <div>
      <Modal
        closeIcon
        size="large"
        closeOnDimmerClick={false}
        trigger={(
          <Button disabled={students.length === 0} color="blue">
            <Icon name="mail" />
            {`Compose email for selected ${students.length} students`}
          </Button>
        )}
      >
        <Modal.Header>Composing email</Modal.Header>
        <Modal.Content>

          <Accordion styled fluid>
            <Accordion.Title active={showingEmails} onClick={() => setShowingEmails(!showingEmails)}>
              <Icon name="dropdown" />
              {`${names.length} ${names.length > 1 ? 'users' : 'user'} selected`}
            </Accordion.Title>
            <Accordion.Content active={showingEmails}>
              {names.map(email => <Label key={email}>{email}</Label>)}
            </Accordion.Content>
          </Accordion>

          <Message info>The email will be sent both to @helsinki email, and to personal email (if set).</Message>
          <div style={{
            display: 'flex', flexDirection: 'column', marginRight: '1em',
          }}
          >
            <span>{`Select a template? (${templateOptions.length} available)`}</span>
            <Select disabled={!templateOptions.length} data-cy="selectTemplate" value={selectedTemplateId} onChange={handleTemplateSelect} style={{ width: '100%', marginBottom: '1em' }} placeholder="Select a template to use it" options={templateOptions} />
          </div>

          <Form onSubmit={handleSubmit} style={{ paddingTop: '1em' }}>
            <Input type="email" fluid placeholder="Optional*" value={replyTo} name="replyTo" onChange={handleChange} label="ReplyTo" labelPosition="left corner" />
            <Input required fluid placeholder="Enter subject.." value={subject} name="subject" onChange={handleChange} label="Subject" labelPosition="left corner" />
            <TextArea style={{ marginBottom: '1em' }} rows={15} required placeholder="Enter text.." value={text} name="text" onChange={handleChange} />
            <EmailStatus />
            <Button
              primary
              type="submit"
              loading={pending}
              disabled={students.length === 0 || error}
              style={{ marginTop: '0.5em' }}
            >
              Send
            </Button>
          </Form>

        </Modal.Content>
      </Modal>
    </div>
  )
}
