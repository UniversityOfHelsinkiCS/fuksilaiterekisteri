import React from 'react'
import { useSelector } from 'react-redux'
import { Modal, Button } from 'semantic-ui-react'
import { localeSelector } from 'Utilities/redux/localeReducer'
import TranslatedMarkdown from 'Components/TranslatedMarkdown'

const translations = {
  close: {
    en: 'Close',
    fi: 'Sulje',
  },
}

const InstructionModal = ({
  open, handleClose,
}) => {
  const locale = useSelector(localeSelector)

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Content>
        <TranslatedMarkdown textKey="acceptableTerms" />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose} data-cy="closeTerms">
          {translations.close[locale]}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default InstructionModal
