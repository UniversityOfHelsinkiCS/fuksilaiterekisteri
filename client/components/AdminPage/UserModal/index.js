import React, { useState, useEffect } from 'react'
import {
  Modal, Form, Button, Icon, TextArea,
} from 'semantic-ui-react'

const UserModal = ({
  open, handleClose, handleSubmit, user,
}) => {
  const [note, setNote] = useState('')

  useEffect(() => {
    if (user) setNote(user.adminNote || '')
  }, [user])

  if (!user) return null
  const handleChange = (_, { value }) => setNote(value)
  const onSubmit = () => handleSubmit({ note, id: user.id })
  return (
    <Modal open={open} onClose={handleClose} size="small">
      <Modal.Header>{`Edit admin note for user ${user.name}`}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <TextArea onChange={handleChange} value={note} />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={handleClose} inverted>
          <Icon name="cancel" />
          {' '}
Peruuta
        </Button>
        <Button color="green" onClick={onSubmit} inverted>
          <Icon name="save" />
          {' '}
Tallenna
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default UserModal
