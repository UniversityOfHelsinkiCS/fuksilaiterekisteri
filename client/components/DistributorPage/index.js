import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Input, Segment } from 'semantic-ui-react'
import { claimDeviceAction } from 'Utilities/redux/deviceClaimReducer'
import { getStudentAction, clearStudentAction } from 'Utilities/redux/studentReducer'

const StudentInfo = ({ student }) => {
  if (!student) return null
  return (
    <div>
      Etunimi:
      <span>{student.name}</span>
      Syntymäaika:
      <span>{student.dateOfBirth}</span>
    </div>
  )
}

const DistributorPage = () => {
  const dispatch = useDispatch()
  const deviceClaim = useSelector(state => state.deviceClaim)
  const student = useSelector(state => state.student)
  const [studentNumber, setStudentNumber] = useState('')
  const [studentNumberValid, setStudentNumberValid] = useState(false)
  const claimDevice = payload => dispatch(claimDeviceAction(payload))
  const clearStudent = () => dispatch(clearStudentAction())
  const getStudent = payload => dispatch(getStudentAction(payload))

  useEffect(() => {
    if (!deviceClaim || deviceClaim.pending || deviceClaim.error || !deviceClaim.data) return

    console.log('Handle device claim success here by emptying existing student')
    setStudentNumber('')
    clearStudent()
  }, deviceClaim)

  const changeStudentNumber = ({ target }) => {
    const { value } = target
    setStudentNumber(value)

    if (value.length !== 9) return setStudentNumberValid(false)

    return setStudentNumberValid(true)
  }

  const handleClaimClick = () => {
    if (!studentNumberValid) return

    claimDevice({ studentNumber })
  }

  const handleStudentClick = () => getStudent(studentNumber)

  const inputRed = !studentNumberValid
  const buttonDisabled = !studentNumberValid
  return (
    <Segment>
      <h1>Hei, lenovo. Olet jakamassa laitteita opiskelijoille </h1>
      <Input
        error={inputRed}
        label="Studentnumber"
        placeholder="0173588391"
        onChange={changeStudentNumber}
      />
      <Button onClick={handleStudentClick}>Hae</Button>

      <StudentInfo student={student} />
      <Button color="purple" onClick={handleClaimClick} disabled={buttonDisabled}>
        Anna laite
      </Button>
    </Segment>
  )
}

export default DistributorPage
