import React from 'react'
import { useSelector } from 'react-redux'
import { Segment, Icon } from 'semantic-ui-react'
import StudentInfo from './StudentInfo'
import Terms from './Terms'
import ClaimingInfo from './ClaimingInfo'

const Task = ({ task, completed }) => {
  if (completed) {
    return (
      <Segment style={{ background: '#d2f3db' }} textAlign="center">
        {task}
        <Icon name="checkmark" size="large" style={{ marginLeft: '10px' }} />
      </Segment>
    )
  }
  return (
    <Segment style={{ background: '#fddede' }} textAlign="center">
      {task}
      <Icon name="cancel" size="large" style={{ marginLeft: '10px' }} />
    </Segment>
  )
}

const StudentStatusPage = () => {
  const user = useSelector(state => state.user.data)
  return (
    <>
      <StudentInfo />
      <Segment>
        <div>Tasks:</div>
        <Segment.Group horizontal>
          <Task task="True Fuksi " completed={user.eligible} />
          <Task task="DIGI-100A completed " completed={user.digiSkillsCompleted} />
          <Task task="Registered to relevant course " completed={user.courseRegistrationCompleted} />
        </Segment.Group>
        {user.eligible && user.digiSkillsCompleted && user.courseRegistrationCompleted ? <ClaimingInfo /> : null}
      </Segment>
      <Terms />
    </>
  )
}

export default StudentStatusPage
