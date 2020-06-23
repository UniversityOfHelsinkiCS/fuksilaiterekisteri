import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Button, Input, Segment, Form, Checkbox,
} from 'semantic-ui-react'
import { deviceRequestAction } from 'Utilities/redux/deviceRequestReducer'
import { localeSelector } from 'Utilities/redux/localeReducer'
import TermsModal from './TermsModal'

const translations = {
  iWantDevice: {
    en: 'I want a device',
    fi: 'Haluan laitteen',
  },
  iWantDeviceWithoutEmail: {
    en: 'I want a device, but I don\'t want to give out my email',
    fi: 'Haluan laitteen, mutta en halua antaa toista sähköpostiosoitettani',
  },
  hello: {
    en: 'Hello',
    fi: 'Hei',
  },
  youAreEntitledToADevice: {
    en: 'You’re entitled to a fresher device. Please type in your non-helsinki.fi email to ensure you’ll receive pickup and other device related information.',
    fi: 'Olet oikeutettu fuksilaitteeseen, anna ei-helsinki.fi sähköpostisi.',
  },
  email: {
    en: 'Email',
    fi: 'Sähköposti',
  },
  instructionsRead: {
    en: 'Instructions read',
    fi: 'Ohjeet luettu',
  },
  areYouSure: {
    en: 'Are you sure?',
    fi: 'Oletko varma?',
  },
}

const RequestDeviceForm = () => {
  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.data)
  const locale = useSelector(localeSelector)
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

  const handleTermsClick = () => {
    setTermsOpen(true)
  }

  const handleAcceptTermsClick = () => {
    setTermsOpen(false)
    setTermsAccepted(true)
  }

  const handleTermsClose = () => setTermsOpen(false)

  const inputRed = !emailValid && email.includes('@') && /\.fi|\.com/.test(email) // Only color input in certain cases
  const primaryButtonDisabled = !emailValid || !termsAccepted // Always disable if not valid
  const secondaryButtonDisabled = !termsAccepted

  return (
    <div>
      <TermsModal open={termsOpen} handleAcceptTermsClick={handleAcceptTermsClick} handleClose={handleTermsClose} />
      <Segment>
        <p>{`${translations.hello[locale]} ${user.name},`}</p>
        <p>{translations.youAreEntitledToADevice[locale]}</p>
        <Form>
          <Input fluid error={inputRed} label={translations.email[locale]} placeholder="@gmail.com" onChange={changeEmail} data-cy="otherEmailInput" />
          <br />
          <br />
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '1em' }}>
            <Checkbox disabled checked={termsAccepted} />
            <span
              onClick={handleTermsClick}
              onKeyDown={handleTermsClick}
              role="button"
              tabIndex={-1}
              style={{
                color: '#4c91cd',
                fontWeight: '550',
                paddingLeft: '0.5em',
                cursor: 'pointer',
              }}
              data-cy="terms"
            >
              {translations.instructionsRead[locale]}
            </span>
          </div>
          <div style={{ display: 'flex' }}>
            <Button style={{ flex: 0.5, paddingTop: '2em', paddingBottom: '2em' }} color="purple" onClick={handleRequestClick} disabled={primaryButtonDisabled} data-cy="getDevicePrimary">
              {translations.iWantDevice[locale]}
            </Button>
            <Button style={{ flex: 0.5, paddingTop: '2em', paddingBottom: '2em' }} onClick={handleNoEmailRequestClick} negative disabled={secondaryButtonDisabled} data-cy="getDeviceSecondary">
              {translations.iWantDeviceWithoutEmail[locale]}
            </Button>
          </div>
        </Form>
      </Segment>
    </div>
  )
}

export default RequestDeviceForm
