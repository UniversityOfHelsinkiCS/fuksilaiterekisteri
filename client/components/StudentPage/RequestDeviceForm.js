import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Button, Input, Segment, Form, Checkbox,
} from 'semantic-ui-react'
import { deviceRequestAction } from 'Utilities/redux/deviceRequestReducer'
import { localeSelector } from 'Utilities/redux/localeReducer'
import InstructionModal from './InstructionModal'

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
  termsAndConditions: {
    en: 'Read the instructions',
    fi: 'Lue ohjeet',
  },
  areYouSure: {
    en: 'Are you sure?',
    fi: 'Oletko varma?',
  },
  iHaveRead: {
    en: 'I have read and understood the instructions',
    fi: 'Olen lukenut ja ymmärtänyt ohjeet',
  },
}

const RequestDeviceForm = ({ faking }) => {
  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [termsHaveBeenOpened, setTermsHaveBeenOpened] = useState(false)
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
    if (!emailValid || faking) return
    dispatch(deviceRequestAction({ email }))
  }

  const handleNoEmailRequestClick = () => {
    if (faking) return
    const res = window.confirm(translations.areYouSure[locale])
    if (res) {
      dispatch(deviceRequestAction({ email: null }))
    }
  }

  const handleTermsClose = () => setTermsOpen(false)

  const inputRed = !emailValid && email.includes('@') && /\.fi|\.com/.test(email) // Only color input in certain cases
  const primaryButtonDisabled = !emailValid || !termsAccepted // Always disable if not valid
  const secondaryButtonDisabled = !termsAccepted

  const handleTermsOpen = () => {
    setTermsOpen(true)
    setTermsHaveBeenOpened(true)
  }

  return (
    <div>
      <InstructionModal open={termsOpen} handleClose={handleTermsClose} />
      <Segment>
        <p>{`${translations.hello[locale]} ${user.name},`}</p>
        <p>{translations.youAreEntitledToADevice[locale]}</p>
        <Form>
          <Input fluid error={inputRed} label={translations.email[locale]} placeholder="@gmail.com" onChange={changeEmail} data-cy="otherEmailInput" />
          <br />
          <br />
          <div style={{ display: 'flex', flexDirection: 'column', padding: '1em 0em' }}>
            <span
              role="button"
              tabIndex={0}
              style={{
                width: '100%', marginBottom: '1em', cursor: 'pointer', color: 'blue',
              }}
              onKeyPress={handleTermsOpen}
              onClick={handleTermsOpen}
              data-cy="terms"
            >
              {translations.termsAndConditions[locale]}
            </span>
            <Checkbox data-cy="acceptTerms" checked={termsAccepted} disabled={!termsHaveBeenOpened} onClick={() => setTermsAccepted(!termsAccepted)} label={translations.iHaveRead[locale]} />
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
