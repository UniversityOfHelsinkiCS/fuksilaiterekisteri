import React from 'react'
import { useSelector } from 'react-redux'
import { Segment, Icon, Header } from 'semantic-ui-react'
import TranslatedText from 'Components/TranslatedText'
import StudentInfo from './StudentInfo'
import ClaimingInfo from './ClaimingInfo'
import TaskInfo from './TaskInfo'

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
    <Segment.Group>
      <StudentInfo />
      <Segment>
        <Header as="h3">Task status:</Header>
        <Segment.Group horizontal>
          <Task task="True Fuksi" completed={user.eligible} />
          <Task
            task="Registered to relevant course"
            completed={user.courseRegistrationCompleted}
          />
          <Task
            task="DIGI-XXXA completed"
            completed={user.digiSkillsCompleted}
          />
        </Segment.Group>
        {user.eligible
        && user.digiSkillsCompleted
        && user.courseRegistrationCompleted ? (
          <ClaimingInfo />
          ) : null}
      </Segment>
      <TaskInfo
        courseRegistrationCompleted={user.courseRegistrationCompleted}
        digiSkillsCompleted={user.digiSkillsCompleted}
      />
      <TranslatedText textKey="deviceSpecs" />
    </Segment.Group>
  )
}

export default StudentStatusPage
