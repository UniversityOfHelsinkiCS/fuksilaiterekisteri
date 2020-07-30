import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Modal, Checkbox, Button, Icon,
} from 'semantic-ui-react'

const StudyProgramModal = ({
  open, handleClose, handleSubmit, user,
}) => {
  const studyProgrammes = useSelector(state => state.studyProgrammes.data)

  const [studyProgramState, setStudyProgramState] = useState([])

  const hasRightsFor = studyProgramId => user.studyPrograms.some(usersStudyProgram => usersStudyProgram.id === studyProgramId)

  useEffect(() => {
    if (user && studyProgrammes) {
      const tempObject = {}
      studyProgrammes.forEach((studyProgram) => {
        tempObject[studyProgram.id] = hasRightsFor(studyProgram.id)
      })
      setStudyProgramState(tempObject)
    }
  }, [user, studyProgrammes])

  if (!user || !studyProgrammes) return null

  const handleCheckboxClick = (studyProgramId) => {
    setStudyProgramState({ ...studyProgramState, [studyProgramId]: !studyProgramState[studyProgramId] })
  }

  const studyProgramCheckBoxes = studyProgrammes.map(studyProgram => (
    <Checkbox
      key={studyProgram.code}
      label={studyProgram.name}
      checked={studyProgramState[studyProgram.id]}
      onChange={() => handleCheckboxClick(studyProgram.id)}
      style={{ marginBottom: '0.5em' }}
    />
  ))

  return (
    <Modal open={open} onClose={handleClose} size="small">
      <Modal.Header>{`Edit study programs for user ${user.name}`}</Modal.Header>
      <Modal.Content>
        <div data-cy="studyProgramCheckboxes" style={{ display: 'flex', flexDirection: 'column' }}>
          {studyProgramCheckBoxes}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={handleClose} inverted>
          <Icon name="cancel" />
          {' '}
          Cancel
        </Button>
        <Button
          data-cy="saveStudyPrograms"
          color="green"
          inverted
          onClick={() => handleSubmit({ id: user.id, studyPrograms: studyProgramState })}
        >
          <Icon name="save" />
          {' '}
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default StudyProgramModal
