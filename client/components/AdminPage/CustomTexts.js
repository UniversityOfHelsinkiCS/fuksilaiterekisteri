import React, { useState, useEffect } from 'react'
import {
  Header, Select, Form, TextArea, Message, Segment, Button,
} from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { setServiceStatus, customTextSelector } from 'Utilities/redux/serviceStatusReducer'

export default function CustomTexts() {
  const dispatch = useDispatch()
  const [selected, setSelected] = useState('deviceSpecs')
  const [texts, setTexts] = useState({})
  const customTexts = useSelector(customTextSelector)
  const pending = useSelector(state => state.serviceStatus.pending)

  useEffect(() => {
    if (customTexts) setTexts(customTexts)
  }, [customTexts])

  const options = [
    { key: 'deviceSpecs', value: 'deviceSpecs', text: 'Device specs' },
    { key: 'notEligible', value: 'notEligible', text: 'Not eligible text' },
    { key: 'registrationClosed', value: 'registrationClosed', text: 'Registration closed text' },
    { key: 'acceptableTerms', value: 'acceptableTerms', text: 'Acceptable terms (Text which user has to agree on when wanting a device)' },
  ]

  const handleSubmit = () => {
    dispatch(setServiceStatus({ customTexts: texts }))
  }

  const handleSelect = (e, { value }) => {
    setSelected(value)
  }

  const handleTextChange = (e, lang) => {
    setTexts({
      ...texts,
      [selected]: {
        ...texts[selected],
        [lang]: e.target.value,
      },
    })
  }

  return (
    <Segment>
      <Header as="h2">Custom texts</Header>
      <Message>These messages are visible to the user (fuksi).</Message>
      <Select data-cy="customTextSelect" value={selected} onChange={handleSelect} style={{ width: '100%', marginBottom: '1em' }} placeholder="Select text to modify" options={options} />
      <Form>
        <span>Finnish:</span>
        <TextArea data-cy="text-fi" value={texts && texts[selected] ? texts[selected].fi : ''} onChange={e => handleTextChange(e, 'fi')} rows={5} placeholder="" />
        <span>English:</span>
        <TextArea data-cy="text-en" value={texts && texts[selected] ? texts[selected].en : ''} onChange={e => handleTextChange(e, 'en')} rows={5} placeholder="" />
        <Button data-cy="saveButton" loading={pending} onClick={handleSubmit} style={{ marginTop: '1em' }}>Save ALL text-changes</Button>
      </Form>
    </Segment>
  )
}
