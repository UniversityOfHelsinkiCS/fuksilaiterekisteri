import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Form, Input, TextArea, Button, Select,
} from 'semantic-ui-react'
import { createOrUpdateReclaimerTemplateAction, deleteReclaimerTemplateAction } from 'Utilities/redux/emailReducer'

const initialState = {
  id: null,
  replyTo: '',
  subject: '',
  body: '',
  description: '',
}

export default function ManageReclaimerTemplates() {
  const dispatch = useDispatch()
  const { reclaimerTemplates, pending, createdId } = useSelector(state => state.email)

  const [emailState, setEmailState] = useState(initialState)

  const handleChange = (e) => {
    const { name, value } = e.target
    setEmailState({
      ...emailState,
      [name]: value,
    })
  }

  useEffect(() => {
    if (createdId) {
      setEmailState({
        ...emailState,
        id: createdId,
      })
    }
  }, [createdId])

  const options = useMemo(() => {
    const temp = reclaimerTemplates.map(({ id, description }) => ({
      key: id,
      value: id,
      text: description,
    }))

    return temp
  }, [reclaimerTemplates])

  const handleSelect = (_e, { value }) => {
    setEmailState(reclaimerTemplates.find(p => p.id === value))
  }

  const handleDelete = () => {
    const confirm = window.confirm(`Delete template ${emailState.description}?`)
    if (confirm) {
      dispatch(deleteReclaimerTemplateAction(emailState.id))
      setEmailState(initialState)
    }
  }

  return (
    <div>
      <div style={{
        display: 'flex', flexDirection: 'column',
      }}
      >
        <span>{`Select a template? (${options.length} available)`}</span>
        <Select disabled={!options.length} data-cy="selectTemplate" value={emailState.id} onChange={handleSelect} style={{ width: '100%', marginBottom: '1em' }} placeholder="Select template to modify it" options={options} />
      </div>
      <Form>
        <Input data-cy="description" fluid placeholder="Description" value={emailState.description} name="description" onChange={handleChange} required label="Description" labelPosition="left corner" />
        <Input data-cy="replyTo" fluid placeholder="Optional" value={emailState.replyTo} name="replyTo" onChange={handleChange} label="Reply-To" type="email" labelPosition="left corner" />
        <Input data-cy="subject" fluid placeholder="Subject" value={emailState.subject} name="subject" onChange={handleChange} required label="Subject" labelPosition="left corner" />
        <TextArea data-cy="body" rows={10} placeholder="Body" value={emailState.body} name="body" onChange={handleChange} required />
        <Button
          primary
          style={{ marginTop: '1rem', alignSelf: 'flex-start' }}
          disabled={pending}
          onClick={() => dispatch(createOrUpdateReclaimerTemplateAction(emailState))}
        >
          {emailState.id ? 'Update this template' : 'Create a new template'}
        </Button>
        {emailState.id && <Button negative onClick={handleDelete}>Delete this template</Button>}
        {emailState.id && <Button onClick={() => setEmailState(initialState)}>Or create a new one instead</Button>}
      </Form>
    </div>
  )
}
