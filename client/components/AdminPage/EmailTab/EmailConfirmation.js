import React from 'react'
import { Modal, Button, Icon } from 'semantic-ui-react'

const EmailConfirmation = ({
  open, handleClose, handleSend, emailAmount,
}) => (
  <Modal open={open}>
    <Modal.Header>Email confirmation</Modal.Header>
    <Modal.Content>{`You are about to send an email to ${emailAmount} recipients`}</Modal.Content>
    <Modal.Actions>
      <Button color="red" inverted onClick={handleClose}>
        <Icon name="remove" />
        {' '}
        Cancel
      </Button>
      <Button color="green" inverted onClick={handleSend}>
        <Icon name="mail" />
        {' '}
        {`Send this email to ${emailAmount} recipients`}
      </Button>
    </Modal.Actions>
  </Modal>
)

export default EmailConfirmation
