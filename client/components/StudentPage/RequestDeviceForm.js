import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Button, Input, Segment, Form,
} from 'semantic-ui-react'
import { deviceRequestAction } from 'Utilities/redux/deviceRequestReducer'

const RequestDeviceForm = () => {
  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.data)
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
    dispatch(deviceRequestAction({ email }))
  }

  const handleNoEmailRequestClick = () => {
    const res = window.confirm('Oletko varma? Are you sure?')
    if (res) {
      dispatch(deviceRequestAction({ email: null }))
    }
  }

  const inputRed = !emailValid && email.includes('@') && /\.fi|\.com/.test(email) // Only color input in certain cases
  const buttonDisabled = !emailValid // Always disable if not valid
  return (
    <div>
      <Segment>
        <p>{`Hei ${user.name},`}</p>
        <p>Olet oikeutettu fuksilaitteeseen, anna ei-helsinki.fi sähköpostisi</p>
        <p>{`Hello ${user.name},`}</p>
        <p>You’re entitled to a fresher device. Please type in your non-helsinki.fi email to ensure you’ll receive pickup and other device related information.</p>
        <Form>
          <Input fluid error={inputRed} label="Email" placeholder="@gmail.com" onChange={changeEmail} />
          <br />
          <br />
          <div style={{ display: 'flex' }}>
            <Button style={{ flex: 0.5 }} color="purple" onClick={handleRequestClick} disabled={buttonDisabled}>
              Haluan laitteen
              <br />
              <br />
              I want a device
            </Button>
            <Button style={{ flex: 0.5 }} onClick={handleNoEmailRequestClick} negative>
              Haluan laitteen, mutta en halua antaa toista sähköpostiosoitettani
              <br />
              <br />
              I want a device, but I don’t want to give out my email
            </Button>
          </div>
        </Form>
      </Segment>
    </div>
  )
}

export default RequestDeviceForm
