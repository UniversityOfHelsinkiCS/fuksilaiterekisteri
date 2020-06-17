import React from 'react'
import { Modal, Button } from 'semantic-ui-react'
import TranslatedText from 'Components/TranslatedText'

const EmailConfirmation = ({
  open, handleAcceptTermsClick, handleClose,
}) => (
  <Modal open={open} onClose={handleClose}>
    <TranslatedText textKey="acceptableTerms" />
    <Modal.Actions>
      <Button onClick={handleAcceptTermsClick}>
        Hyväksyn nämä ehdot.
      </Button>
    </Modal.Actions>
  </Modal>
)

export default EmailConfirmation
