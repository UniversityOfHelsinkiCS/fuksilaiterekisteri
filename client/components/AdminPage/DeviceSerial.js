import React, { useEffect, useState } from 'react'
import {
  Segment, Header, Button, Message,
} from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { setServiceStatus } from 'Utilities/redux/serviceStatusReducer'

export default function DeviceSerial() {
  const currentSerial = useSelector(state => state.serviceStatus.data.deviceSerial)
  const [newSerial, setSerial] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentSerial) setSerial(currentSerial)
  }, [currentSerial])

  const handleSerialUpdate = () => {
    const confirm = window.confirm('Update serial?')
    if (confirm) dispatch(setServiceStatus({ deviceSerial: newSerial }))
  }

  return (
    <Segment>
      <Header as="h2">Device serial</Header>
      <Message>Beginning part of the serial which is same for all of this years devices. For example 1s20N3S2NJ00PF1 </Message>
      <input data-cy="deviceSerial" onChange={e => setSerial(e.target.value)} value={newSerial} />
      <Button style={{ marginLeft: '1em' }} data-cy="updateSerial" onClick={handleSerialUpdate}>Update serial</Button>
    </Segment>
  )
}
