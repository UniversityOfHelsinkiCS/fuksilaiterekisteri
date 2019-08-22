import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Button, Segment, Form, Header, Ref,
} from 'semantic-ui-react'
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
  const cubbli = ['KH50_002', 'KH50_005']

  if (cubbli.includes(code)) {
    return <p style={{ marginLeft: '10px', fontWeight: 'bold', color: 'orange' }}>Cubbli</p>
  } 
  return <p style={{ marginLeft: '10px', fontWeight: 'bold', color: 'blue' }}>Windows</p>
}

const StudentInfo = ({ student }) => {
  if (!student) return null
  return (
    <div>
      <div>
        {`Etunimi: ${student.name}`}
      </div>
      <div>
        {`Syntymäaika: ${formatDateOfBirth(student.dateOfBirth)}`}
      </div>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <h4>Opinto-ohjelma(t):</h4>
        {
          student.studyPrograms.map(({ code, name }) => (
            <div key={code} style={{ display: 'flex' }}>
              <p>{`- ${name}, ${code}`}</p>
              { getOs(code) }
            </div>
          ))
        }
      </div>
    </div>
  )
}

const DistributorPage = () => {
  const dispatch = useDispatch()
  const deviceClaim = useSelector(state => state.deviceClaim)
  const student = useSelector(state => state.student.data)
  const error = useSelector(state => state.student.error)
  const [studentNumber, setStudentNumber] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [studentNumberValid, setStudentNumberValid] = useState(false)
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
    if (!deviceClaim || deviceClaim.pending || deviceClaim.error || !deviceClaim.data) return
    setStudentNumber('')
    setDeviceId('')
    clearStudent()

    if (studentInput.current) studentInput.current.children[1].children[0].focus()
  }, [deviceClaim])

  useEffect(() => {
    if (student && deviceIdInput.current) deviceIdInput.current.children[0].children[0].focus()
  }, [deviceIdInput.current, student])

  const changeStudentNumber = ({ target }) => {
    const { value } = target
    setStudentNumber(value)
    if (value.length !== 9) return setStudentNumberValid(false)
    return setStudentNumberValid(true)
  }

  const changeDeviceId = (e, { value }) => setDeviceId(value)

  const handleClaimClick = () => {
    if (!student) return
    claimDevice({ studentNumber: student.studentNumber, deviceId })
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
    if (!isEligibleForDevice()) return <p>Ei oikeutettu laitteeseen!</p>
    return (
      <>
        <StudentInfo student={student} />
        <Form>
          <Form.Group>
            <Ref innerRef={handleDeviceRef}>
              <Form.Input onChange={changeDeviceId} value={deviceId} />
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
    <Segment>
      <Form>
        <Header as="h1">Hei, jakelija. Olet jakamassa laitteita opiskelijoille</Header>
        <Form.Group inline>
          <Ref innerRef={handleStudentRef}>
            <Form.Input
              error={inputRed}
              label="Studentnumber"
              placeholder="0173588391"
              onChange={changeStudentNumber}
              value={studentNumber}
            />
          </Ref>
          <Form.Button onClick={handleStudentClick}>Hae</Form.Button>
        </Form.Group>
      </Form>
      { renderStudentData() }
      {
        !!deviceClaim.error && student
        && <p>Laitteen antaminen epäonnistui</p>
      }
    </Segment>
  )
}

export default DistributorPage
