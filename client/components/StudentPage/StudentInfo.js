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
    </Segment>
  )
}

export default StudentInfo
