import React, { useEffect, useState } from 'react'
import {
  Segment, Header, Button, Message, Input,
} from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { setServiceStatus } from 'Utilities/redux/serviceStatusReducer'

export default function DeviceSerial() {
  const currentSerial = useSelector(state => state.serviceStatus.data.deviceSerial)
  const currentSerialSeparatorPos = useSelector(state => state.serviceStatus.data.serialSeparatorPos)
  const [newSerial, setSerial] = useState('')
  const [separatorPosition, setSeparatorPosition] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentSerial) setSerial(currentSerial)
  }, [currentSerial])

  useEffect(() => {
    if (currentSerialSeparatorPos) setSeparatorPosition(currentSerialSeparatorPos)
  }, [currentSerialSeparatorPos])

  const handleSerialUpdate = () => {
    const confirm = window.confirm('Update serial and separator position?')
    if (confirm) dispatch(setServiceStatus({ deviceSerial: newSerial, serialSeparatorPos: separatorPosition }))
  }

  const separatorIsValid = !((newSerial.length - separatorPosition) <= 0) && separatorPosition !== 0

  return (
    <Segment>
      <Header as="h2">Device serial</Header>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>
          Input an example of
          <b> a full-length </b>
          serial. For example 1S20N3S2NJ00PF1XXXXX.
        </span>
        <Input data-cy="deviceSerial" onChange={e => setSerial(e.target.value)} value={newSerial.toUpperCase()} />
      </div>
      <Message>
        Select a location for the separator by clicking on the first letter (below) that you wish to save. If you want to include some of the &quot;static part&quot; in the database, simply make sure to include that in the green selector.
        <br />
        <span style={{ color: 'red' }}>Static part. Same for all devices. Will not be stored in the database. Only used for validation when devices are being distributed.</span>
        <br />
        <span style={{ color: 'green' }}>Custom part. The part of the serial which will be stored in the database.</span>
      </Message>
      <div style={{ paddingTop: '1em', lineHeight: '50px' }}>
        {newSerial.split('').map((l, idx) => {
          const color = idx < separatorPosition ? 'red' : 'green'
          return (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              data-cy={`letter-${idx + 1}`}
              role="button"
              tabIndex={0}
              style={{ color, fontSize: '50px', cursor: 'pointer' }}
              onClick={() => setSeparatorPosition(idx)}
              onKeyPress={() => setSeparatorPosition(idx)}
            >
              {l}
            </span>
          )
        })}
      </div>
      <div>
        {`Full serial legth is ${newSerial.length} characters.`}
      </div>
      {!separatorIsValid ? <Message error>You must select a valid separator!</Message> : (
        <div>
          {`Last ${newSerial.length - separatorPosition} characters will be stored to the database.`}
        </div>
      )}
      <Button disabled={!separatorIsValid} data-cy="updateSerial" onClick={handleSerialUpdate}>Update serial and separator</Button>
    </Segment>
  )
}
