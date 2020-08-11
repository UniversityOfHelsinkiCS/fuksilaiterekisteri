import React, { useState, useEffect } from 'react'
import {
  Header, Select, Form, TextArea, Message, Segment, Button,
} from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { setServiceStatus, customTextSelector } from 'Utilities/redux/serviceStatusReducer'
import NotEligible from 'Components/StudentPage/NotEligible'
import TranslatedMarkdown from 'Components/TranslatedMarkdown'
import StudentStatusPage from 'Components/StudentPage/TaskStatus'
import RequestDeviceForm from 'Components/StudentPage/RequestDeviceForm'
import { LocaleSelector } from 'Components/NavBar'

const MarkdownPreview = textKey => (
  <Segment>
    <TranslatedMarkdown textKey={textKey} />
  </Segment>
)

const componentMap = {
  deviceSpecs: StudentStatusPage,
  notEligible: NotEligible,
  registrationClosed: () => MarkdownPreview('registrationClosed'),
  acceptableTerms: RequestDeviceForm,
  distributionInfo: StudentStatusPage,
}

export default function CustomTexts() {
  const dispatch = useDispatch()
  const [selected, setSelected] = useState('deviceSpecs')
  const [texts, setTexts] = useState({})
  const [acceptableTermsOpen, setAcceptableTermsOpen] = useState(false)
  const customTexts = useSelector(customTextSelector)
  const pending = useSelector(state => state.serviceStatus.pending)

  useEffect(() => {
    if (customTexts) setTexts(customTexts)
  }, [customTexts])

  const options = [
    { key: 'deviceSpecs', value: 'deviceSpecs', text: 'Device specs' },
    { key: 'notEligible', value: 'notEligible', text: 'Not eligible text (Shown when student has no valid study rights, has previous study right or is not present)' },
    { key: 'registrationClosed', value: 'registrationClosed', text: 'Registration closed text' },
    { key: 'acceptableTerms', value: 'acceptableTerms', text: 'Acceptable terms (Text which user has to agree on when wanting a device)' },
    { key: 'distributionInfo', value: 'distributionInfo', text: 'Task deadline and distribution info' },
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

  const PreviewComponent = componentMap[selected]

  return (
    <Segment>
      <Header as="h2">Custom texts</Header>
      <Message>These messages are visible to the user (fuksi).</Message>
      <Select data-cy="customTextSelect" value={selected} onChange={handleSelect} style={{ width: '100%', marginBottom: '1em' }} placeholder="Select text to modify" options={options} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Form style={{ width: '48%' }}>
          <span>Finnish:</span>
          <TextArea data-cy="text-fi" value={texts && texts[selected] ? texts[selected].fi : ''} onChange={e => handleTextChange(e, 'fi')} rows={15} placeholder="" />
          <span>English:</span>
          <TextArea data-cy="text-en" value={texts && texts[selected] ? texts[selected].en : ''} onChange={e => handleTextChange(e, 'en')} rows={15} placeholder="" />
          <Button data-cy="saveButton" loading={pending} onClick={handleSubmit} style={{ marginTop: '1em' }}>Save ALL text-changes</Button>
        </Form>
        <div style={{ width: '48%' }}>
          <div style={{ display: 'flex' }}>
            <span style={{ marginRight: '1em' }}>Preview</span>
            <LocaleSelector />
          </div>
          <PreviewComponent faking acceptableTermsOpen={acceptableTermsOpen} setAcceptableTermsOpen={setAcceptableTermsOpen} />
        </div>
      </div>
    </Segment>
  )
}
