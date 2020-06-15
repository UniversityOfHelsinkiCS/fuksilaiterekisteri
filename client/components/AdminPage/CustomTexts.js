import React from 'react'
import {
  Header, Select, Form, TextArea, Message, Segment,
} from 'semantic-ui-react'

export default function CustomTexts() {
  // TODO: use acual data

  const options = [
    { key: 'deviceSpecs', value: 'deviceSpecs', text: 'Device specs' },
    { key: 'notEligible', value: 'notEligible', text: 'Not eligible text' },
    { key: 'registrationClosed', value: 'registrationClosed', text: 'Registration closed text' },
    { key: 'acceptableTerms', value: 'acceptableTerms', text: 'Acceptable terms (Text which user has to agree on when wanting a device)' },
    { key: 'deviceSerialStartDigits', value: 'deviceSerialStartDigits', text: 'First few digits from serial to prevent accidents in scanning)' },
  ]

  return (
    <Segment>
      <Header as="h2">Custom texts</Header>
      <Message>These messages are visible to the user (fuksi).</Message>
      <Select style={{ width: '100%', marginBottom: '1em' }} placeholder="Select text to modify" options={options} />
      <Form>
        <TextArea rows={5} placeholder="" />
      </Form>
    </Segment>
  )
}
