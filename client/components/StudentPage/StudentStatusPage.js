import React from 'react'
import { useSelector } from 'react-redux'
import { Segment, Icon } from 'semantic-ui-react'

const Task = ({ task, completed }) => {
  if (completed) {
    return (
      <div style={{ background: '#d2f3db' }}>
        {task}
        <Icon name="checkmark" />
      </div>
    )
  }
  return (
    <div style={{ background: '#fddede' }}>
      {task}
      <Icon name="cancel" />
    </div>
  )
}

const StudentStatusPage = () => {
  const user = useSelector(state => state.user)
  return (
    <Segment>
      <div>{`Name ${user.data.name}`}</div>
      <div>{`Student number ${user.data.studentNumber}`}</div>
      <div>Tasks:</div>
      <Task task="True Fuksi " completed={user.data.eligible} />
      <Task task="DIGI-100A completed " completed={user.data.digiSkillsCompleted} />
      <Task
        task="Registered to relevant course "
        completed={user.data.courseRegistrationCompleted}
      />
    </Segment>
  )
}

export default StudentStatusPage
