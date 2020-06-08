import React from 'react'
import {
  Header, TextArea, Button, Input, Form,
} from 'semantic-ui-react'

const AutoEmail = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Header as="h4">Automated email sent to students who have completed all needed tasks. (IN PROGRESS, NOT WORKING YET)</Header>
    <Form>
      <Input fluid placeholder="Subject" />
      <TextArea rows={10} placeholder="Text" />
      <Button primary style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>Save</Button>
    </Form>
  </div>
)

export default AutoEmail
