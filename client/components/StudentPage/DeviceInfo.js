import React from 'react'
import { useSelector } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'
import TranslatedText from 'Components/TranslatedText'
import StudentInfo from './StudentInfo'

const DeviceInfo = () => {
  const user = useSelector(state => state.user.data)

  return (
    <Segment.Group>
      <StudentInfo />
      <Segment>
        <div>
          <Header as="h5">Device serial:</Header>
          {user.deviceSerial}
        </div>
        <div>
          <Header as="h5">Device given at:</Header>
          {user.deviceGivenAt}
        </div>
      </Segment>
      <TranslatedText textKey="deviceSpecs" />
    </Segment.Group>
  )
}

export default DeviceInfo
