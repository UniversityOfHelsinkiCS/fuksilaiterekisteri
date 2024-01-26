import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Button, Segment, Form, Checkbox,
} from 'semantic-ui-react'
import { deviceRequestAction } from 'Utilities/redux/deviceRequestReducer'
import { localeSelector } from 'Utilities/redux/localeReducer'
import InstructionModal from './InstructionModal'

const translations = {
  iWantDevice: {
    en: 'I want a device',
    fi: 'Haluan laitteen',
  },
  hello: {
    en: 'Hello',
    fi: 'Hei',
  },
  youAreEntitledToADevice: {
    en: '...',
    fi: 'Olet oikeutettu normaalin jakelun ulkopuolella annettavaan fuksilaitteeseen',
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

const ExtendedRequestDeviceForm = () => {
  const [termsOpen, setTermsOpen] = useState(false)
  const [termsHaveBeenOpened, setTermsHaveBeenOpened] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.data)
  const locale = useSelector(localeSelector)

  const handleRequestClick = () => {
    dispatch(deviceRequestAction({ extended: true, email: null }))
  }

  const handleTermsClose = () => setTermsOpen(false)

  const primaryButtonDisabled = !termsAccepted // Always disable if not valid

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
            <Button style={{ flex: 1, paddingTop: '2em', paddingBottom: '2em' }} color="purple" onClick={handleRequestClick} disabled={primaryButtonDisabled} data-cy="getDevicePrimary">
              {translations.iWantDevice[locale]}
            </Button>
          </div>
        </Form>
      </Segment>
    </div>
  )
}

export default ExtendedRequestDeviceForm
