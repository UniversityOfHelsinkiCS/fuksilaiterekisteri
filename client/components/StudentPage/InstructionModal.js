import React from 'react'
import { useSelector } from 'react-redux'
import { Modal, Button } from 'semantic-ui-react'
import { localeSelector } from 'Utilities/redux/localeReducer'
import TranslatedMarkdown from 'Components/TranslatedMarkdown'

const translations = {
  iHaveRead: {
    en: 'I have read and understood the instructions',
    fi: 'Olen lukenut ja ymmärtänyt ohjeet',
  },
}

const InstructionModal = ({
  open, handleAcceptTermsClick, handleClose,
}) => {
  const locale = useSelector(localeSelector)

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Content>
        <TranslatedMarkdown textKey="acceptableTerms" />
      </Modal.Content>
      <Modal.Actions>
        <Button inverted color="green" onClick={handleAcceptTermsClick} data-cy="acceptTerms">
          {translations.iHaveRead[locale]}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default InstructionModal
