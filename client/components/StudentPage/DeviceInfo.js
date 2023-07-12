import React from 'react'
import { useSelector } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'
import * as ReactMarkdown from 'react-markdown'
import { localeSelector } from 'Utilities/redux/localeReducer'
import StudentInfo from './StudentInfo'
import deviceTexts from './deviceTexts'

const getDeviceText = (date, locale) => deviceTexts[date.getFullYear()][locale]

const DeviceInfo = () => {
  const locale = useSelector(localeSelector)
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
      <Segment>
        <ReactMarkdown source={getDeviceText(user.deviceGivenAt, locale)} />
      </Segment>
    </Segment.Group>
  )
}

export default DeviceInfo
