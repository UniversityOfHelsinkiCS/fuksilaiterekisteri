import React from 'react'
import { useSelector } from 'react-redux'
import { Segment } from 'semantic-ui-react'

const StudentInfo = () => {
  const user = useSelector(state => state.user.data)

  return (
    <Segment>
      <div>{`Name: ${user.name}`}</div>
      <div>{`Student number: ${user.studentNumber}`}</div>
      <div>{`University email: ${user.hyEmail}`}</div>
      <div>{`Personal email: ${user.personalEmail}`}</div>
      <div>{`Study Program(s): ${user.studyPrograms.map(sp => sp.name).join(', ')}`}</div>
    </Segment>
  )
}

export default StudentInfo
