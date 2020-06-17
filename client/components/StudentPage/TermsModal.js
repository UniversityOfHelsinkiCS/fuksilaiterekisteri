import React from 'react'
import { Modal, Button } from 'semantic-ui-react'
import TranslatedMarkdown from 'Components/TranslatedMarkdown'

const EmailConfirmation = ({
  open, handleAcceptTermsClick, handleClose,
}) => (
  <Modal open={open} onClose={handleClose}>
    <Modal.Content>
      <TranslatedMarkdown textKey="acceptableTerms" />
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={handleAcceptTermsClick}>
        Hyväksyn nämä ehdot
        <br />
        <br />
        I accept these terms
      </Button>
    </Modal.Actions>
  </Modal>
)

export default EmailConfirmation
