import React from 'react'
import { useSelector } from 'react-redux'
import { Segment } from 'semantic-ui-react'

const StudentStatusPage = () => {
  const user = useSelector(state => state.user)
  return (
    <Segment>
      <div>{`Name ${user.data.name}`}</div>
    </Segment>
  )
}

export default StudentStatusPage
