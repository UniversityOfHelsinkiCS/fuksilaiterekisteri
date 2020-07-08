import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Form, Input, Header, Segment, Button, Message,
} from 'semantic-ui-react'
import { updateStudyProgrammesAction } from 'Utilities/redux/studyProgrammeReducer'

export default function StudyProgrammeContactDetails() {
  const dispatch = useDispatch()
  const studyProgrammes = useSelector(state => state.studyProgrammes.data)
  const [state, setState] = useState([])

  useEffect(() => {
    if (studyProgrammes) setState(studyProgrammes)
  }, [studyProgrammes])

  const handleChange = (e, code) => {
    const { name, value } = e.target
    setState(state.map((elem) => {
      if (elem.code === code) {
        // eslint-disable-next-line no-param-reassign
        elem[name] = value
      }
      return elem
    }))
  }

  const saveChanges = (e) => {
    e.preventDefault()
    const confirm = window.confirm('Save email and name changes?')
    if (confirm) dispatch(updateStudyProgrammesAction(state))
  }

  return (
    <Segment>
      <Header as="h2">Studyprogramme contact details</Header>
      <Message info>These contact details are shown to students using the system so that they can easily figure out who to contact if something is not clear.</Message>
      <Form>
        {state.map(({
          code, contactName, contactEmail, name,
        }) => (
          <div style={{ padding: '1em 0em' }} key={code}>
            <Header as="h4">{name}</Header>
            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                name="contactName"
                value={contactName || ''}
                onChange={e => handleChange(e, code)}
                label="Name"
                autoComplete="nope"
              />
              <Form.Field
                control={Input}
                name="contactEmail"
                value={contactEmail || ''}
                onChange={e => handleChange(e, code)}
                label="Email"
                autoComplete="nope"
              />
            </Form.Group>
          </div>
        ))}
        <Button onClick={saveChanges}>Save changes</Button>
      </Form>
    </Segment>
  )
}
