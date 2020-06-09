import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getReadyTemplate, updateReadyTemplate } from 'Utilities/redux/emailReducer'
import {
  Header, TextArea, Button, Input, Form, Loader,
} from 'semantic-ui-react'

const AutoEmail = () => {
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')

  const { pending, readyTemplate } = useSelector(({ email }) => email)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getReadyTemplate())
  }, [])

  useEffect(() => {
    setSubject(readyTemplate.subject)
    setText(readyTemplate.body)
  }, [readyTemplate])

  const handleSubjectChange = e => setSubject(e.target.value)
  const handleTextChange = e => setText(e.target.value)
  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(updateReadyTemplate(subject, text))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Loader active={pending} />
      <Header as="h4">Automated email sent to students who have completed all needed tasks. (IN PROGRESS, NOT WORKING YET)</Header>
      <Form onSubmit={handleSubmit}>
        <Input fluid placeholder="Subject" value={subject} onChange={handleSubjectChange} required />
        <TextArea rows={10} placeholder="Text" value={text} onChange={handleTextChange} required />
        <Button
          type="submit"
          primary
          style={{ marginTop: '1rem', alignSelf: 'flex-start' }}
          disabled={pending}
        >
          Save
        </Button>
      </Form>
    </div>
  )
}
export default AutoEmail
