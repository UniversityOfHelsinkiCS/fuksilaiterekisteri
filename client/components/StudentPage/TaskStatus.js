import React from 'react'
import { useSelector } from 'react-redux'
import { Segment, Icon } from 'semantic-ui-react'
import StudentInfo from './StudentInfo'
import Terms from './Terms'

const Task = ({ task, completed }) => {
  if (completed) {
    return (
      <Segment style={{ background: '#d2f3db' }}>
        {task}
        <Icon name="checkmark" />
      </Segment>
    )
  }
  return (
    <Segment style={{ background: '#fddede' }}>
      {task}
      <Icon name="cancel" />
    </Segment>
  )
}

const StudentStatusPage = () => {
  const user = useSelector(state => state.user)
  return (
    <>
      <StudentInfo />
      <Segment>
        <div>Tasks:</div>
        <Segment.Group horizontal>
          <Task task="True Fuksi " completed={user.data.eligible} />
          <Task task="DIGI-100A completed " completed={user.data.digiSkillsCompleted} />
          <Task task="Registered to relevant course " completed={user.data.courseRegistrationCompleted} />
        </Segment.Group>
      </Segment>
      <Terms />
    </>
  )
}

export default StudentStatusPage
