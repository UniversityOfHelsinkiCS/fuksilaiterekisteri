import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Input, Segment } from 'semantic-ui-react'
import { newDeviceRequestAction } from 'Utilities/redux/deviceRequestReducer'

const StudentPage = ({ requestDevice }) => {
  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)

  const validateEmail = (checkEmail) => {
    const validationRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    // Returns true if valid
    return validationRegex.test(checkEmail) && !checkEmail.includes('helsinki.') && !checkEmail.includes('@cs.')
  }

  const changeEmail = ({ target }) => {
    const { value } = target
    setEmail(value)

    if (!validateEmail(value)) return setEmailValid(false)

    return setEmailValid(true)
  }

  const handleRequestClick = () => {
    if (!emailValid) return

    requestDevice({ email })
  }

  const inputRed = !emailValid && email.includes('@') && (/\.fi|\.com/.test(email)) // Only color input in certain cases
  const buttonDisabled = !emailValid // Always disable if not valid
  return (
    <Segment>
      <h1>Hei, olet oikeutettu opiskelija etkä ole hakenut vielä laitettasi </h1>
      <Input
        error={inputRed}
        label="Kotiemail"
        placeholder="@gmail.com"
        onChange={changeEmail}
      />
      <br />
      <br />
      <Button color="purple" onClick={handleRequestClick} disabled={buttonDisabled}>
        Haluan laitteen
      </Button>
    </Segment>
  )
}

const mapStateToProps = ({ deviceRequest }) => ({
  deviceRequest,
})

const mapDispatchToProps = dispatch => ({
  requestDevice: payload => dispatch(newDeviceRequestAction(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentPage)
