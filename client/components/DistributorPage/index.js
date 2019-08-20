import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Input, Segment } from 'semantic-ui-react'
import { claimDeviceAction } from 'Utilities/redux/deviceRequestReducer'
import { getStudentAction } from 'Utilities/redux/studentReducer'

const DistributorPage = ({ claimDevice, student }) => {
  const [studentNumber, setStudentNumber] = useState('')
  const [studentNumberValid, setStudentNumberValid] = useState(false)

  const validateEmail = (checkEmail) => {
    const validationRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    // Returns true if valid
    return validationRegex.test(checkEmail) && !checkEmail.includes('helsinki.') && !checkEmail.includes('@cs.')
  }

  const changeStudentNumber = ({ target }) => {
    const { value } = target
    setStudentNumber(value)

    if (!validateEmail(value)) return setStudentNumberValid(false)

    return setStudentNumberValid(true)
  }

  const handleClaimClick = () => {
    if (!studentNumberValid) return

    claimDevice({ studentNumber })
  }

  const handleStudentClick = () => {

  }

  const inputRed = !studentNumberValid
  const buttonDisabled = !studentNumberValid
  return (
    <Segment>
      <h1>Hei, olet oikeutettu opiskelija etkä ole hakenut vielä laitettasi </h1>
      <Input
        error={inputRed}
        label="Studentnumber"
        placeholder="0173588391"
        onChange={changeStudentNumber}
      />
      <Button onClick={handleStudentClick}>Hae</Button>
      <br />
      {student && student.name}
      {student && student.dateOfBirth}
      <br />
      <Button color="purple" onClick={handleClaimClick} disabled={buttonDisabled}>
        Anna laite
      </Button>
    </Segment>
  )
}

const mapStateToProps = ({ deviceClaim, student }) => ({
  deviceClaim,
  student,
})

const mapDispatchToProps = dispatch => ({
  claimDevice: payload => dispatch(claimDeviceAction(payload)),
  getStudent: studentNumber => dispatch(getStudentAction(studentNumber)),
})


export default connect(mapStateToProps, mapDispatchToProps)(DistributorPage)
