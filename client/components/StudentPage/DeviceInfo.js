import React from 'react'
import { useSelector } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import StudentInfo from './StudentInfo'
import Terms from './Terms'

const DeviceInfo = () => {
  const user = useSelector(state => state.user.data)

  return (
    <Segment.Group>
      <StudentInfo />
      <Segment>
        <div>{`Device serial: ${user.deviceSerial}`}</div>
        <div>{`Device given at: ${user.deviceGivenAt}`}</div>
      </Segment>
      <Terms />
    </Segment.Group>
  )
}

export default DeviceInfo
