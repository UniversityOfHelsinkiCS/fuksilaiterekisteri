import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Button, Segment, Form, Header, Ref,
} from 'semantic-ui-react'
import { NotificationManager } from 'react-notifications'
import { claimDeviceAction } from 'Utilities/redux/deviceClaimReducer'
import { getStudentAction, clearStudentAction } from 'Utilities/redux/studentReducer'

const formatDateOfBirth = (dateOfBirth) => {
  const dateAsString = String(dateOfBirth)
  const year = dateAsString.slice(0, 4)
  const month = dateAsString.slice(4, 6)
  const day = dateAsString.slice(6, 8)
  return `${day}.${month}.${year}`
}

const getOs = (code) => {
  const cubbli = ['KH50_002', 'KH50_005', 'KH50_008']

  if (cubbli.includes(code)) {
    return (
      <span style={{
        fontSize: '22px', marginLeft: '10px', fontWeight: 'bold', color: 'orange',
      }}
      >
Cubbli
      </span>
    )
  }
  return (
    <span style={{
      fontSize: '22px', marginLeft: '10px', fontWeight: 'bold', color: 'blue',
    }}
    >
Windows
    </span>
  )
}

const Warning = () => <p style={{ fontSize: '20px', color: 'red', fontWeight: 'bold' }}>Muista tarkistaa henkilöllisyys!</p>

const StudentInfo = ({ student }) => {
  if (!student) return null
  return (
    <div>
      <div>
        <b>Nimi: </b>
        {student.name}
      </div>
      <div>
        <b>Syntymäaika: </b>
        {formatDateOfBirth(student.dateOfBirth)}
      </div>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Warning />
        <h4>Opinto-ohjelma(t):</h4>
        {student.studyPrograms.map(({ code, name }) => (
          <div key={code} style={{ display: 'flex' }}>
            <p>{`- ${name}, ${code}`}</p>
            {getOs(code)}
          </div>
        ))}
      </div>
    </div>
  )
}

const parseId = (rawId) => {
  if (rawId.length !== 5 && rawId.length !== 20) return null
  if (rawId.length === 5) return `PF1${rawId.toUpperCase()}`
  if (rawId.substring(0, 15) === '1s20N3S2NJ00PF1') return rawId.substring(12, 20).toUpperCase()
  return null
}

const DistributorPage = () => {
  const dispatch = useDispatch()
  const deviceClaim = useSelector(state => state.deviceClaim)
  const student = useSelector(state => state.student.data)
  const error = useSelector(state => state.student.error)
  const [studentNumber, setStudentNumber] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [studentNumberValid, setStudentNumberValid] = useState(false)
  const [showParsedDeviceId, setShowParsedDeviceId] = useState(false)
  const deviceIdInput = useRef(null)
  const studentInput = useRef(null)
  const claimDevice = payload => dispatch(claimDeviceAction(payload))
  const clearStudent = () => dispatch(clearStudentAction())
  const getStudent = payload => dispatch(getStudentAction(payload))

  const handleDeviceRef = (node) => {
    deviceIdInput.current = node
  }
  const handleStudentRef = (node) => {
    studentInput.current = node
  }
  useEffect(() => {
    if (!deviceClaim || deviceClaim.pending || deviceClaim.error || !deviceClaim.data || !student) return
    setStudentNumber('')
    setDeviceId('')
    clearStudent()

    NotificationManager.success('Laite annettu onnistuneesti!')
    if (studentInput.current) studentInput.current.children[1].children[0].focus()
  }, [deviceClaim])

  useEffect(() => {
    if (student && deviceIdInput.current) deviceIdInput.current.children[0].children[0].focus()
  }, [student])

  useEffect(() => {
    if (deviceClaim.error) NotificationManager.error('Laitteen antaminen epäonnistui')
  }, [deviceClaim.error])

  useEffect(() => {
    if (showParsedDeviceId) {
      const res = window.confirm(`Haluatko varmasti antaa laitteen ${parseId(deviceId)} henkilölle ${student.name}?`)
      if (res) claimDevice({ studentNumber: student.studentNumber, deviceId: parseId(deviceId) })
      setShowParsedDeviceId(false)
    }
  }, [showParsedDeviceId])

  const changeStudentNumber = ({ target }) => {
    const { value } = target
    setStudentNumber(value)
    if (value.length !== 9) return setStudentNumberValid(false)
    return setStudentNumberValid(true)
  }

  /**
   *
   * Barcode reader likes to do stuff we don't want so we have to pick which keypresses to add into the id manually, thanks
   *
   * @param {*} event The stuff, regular synthetic event
   */
  /*
  const filterKeypress = (event) => {
    // These have to be here at the beginning, don't try conditionals here. We tried
    event.stopPropagation()
    event.preventDefault()

    if (event.keyCode === 8) {
      setDeviceId('')
    }

    // Prevent 16 = Shift and 13 = Enter and 17 = Control from being added to deviceId
    if (event.keyCode === 16 || event.keyCode === 13 || event.keyCode === 17) return
    // Prevent J as the reader device tries to push CONTROL + J at the end of an input. CONTROL + J opens Downloads in Chrome.
    // Only prevent J if control is pressed since it may be in device code
    if (event.keyCode === 74 && event.ctrlKey) return

    setDeviceId(`${deviceId}${event.key.toUpperCase()}`)
  }
  */

  const changeDeviceId = (e, { value }) => setDeviceId(value)

  const handleClaimClick = () => {
    if (!student || !parseId(deviceId)) return
    setShowParsedDeviceId(true)
  }

  const handleStudentClick = () => {
    clearStudent()
    setDeviceId('')
    getStudent(studentNumber)
  }
  const inputRed = !studentNumberValid
  const buttonDisabled = !student

  const isEligibleForDevice = () => student && student.eligible && student.digiSkillsCompleted && student.courseRegistrationCompleted && student.wantsDevice

  const renderStudentData = () => {
    if (!student && !error) return null
    if (error) return <p>Opiskelijaa ei löytynyt!</p>
    if (student.deviceGivenAt) return <p>Opiskelija on jo saanut laitteen!</p>
    if (!isEligibleForDevice()) return <p>Ei oikeutettu laitteeseen!</p>
    return (
      <>
        <StudentInfo student={student} />
        <Form>
          <Form.Group>
            <Ref innerRef={handleDeviceRef}>
              <Form.Input id="device-serial-input" onChange={changeDeviceId} value={deviceId} />
            </Ref>
            <Button color="purple" onClick={handleClaimClick} disabled={buttonDisabled}>
              Anna laite
            </Button>
          </Form.Group>
        </Form>
      </>
    )
  }

  return (
    <Segment style={{ alignSelf: 'center' }}>
      <Form>
        <Header as="h1">Matemaattis-luonnontieteellisen tiedekunnan fuksilaitteiden jakelu</Header>
        <Form.Group inline>
          <Ref innerRef={handleStudentRef}>
            <Form.Input error={inputRed} label="Opiskelijanumero" placeholder="0173588391" onChange={changeStudentNumber} value={studentNumber} />
          </Ref>
          <Form.Button onClick={handleStudentClick}>Hae</Form.Button>
        </Form.Group>
      </Form>
      {renderStudentData()}
      {!!deviceClaim.error && student && <p>Laitteen antaminen epäonnistui</p>}
      <span style={{ fontSize: '36px', fontWeight: 'bold' }}>
        {
          showParsedDeviceId
          && (
          <>
            <span>{`${parseId(deviceId).substring(0, 4)}`}</span>
            <span style={{ color: '#a333c8' }}>{`${parseId(deviceId).substring(4, 8)}`}</span>
          </>
          )
        }
      </span>
    </Segment>
  )
}

export default DistributorPage
