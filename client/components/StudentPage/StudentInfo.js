import React from 'react'
import { useSelector } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'

const StudentInfo = () => {
  const user = useSelector(state => state.user.data)

  return (
    <Segment>
      <div>
        <Header as="h5">Nimi / Name:</Header>
        {user.name}
      </div>
      <div>
        <Header as="h5">Opiskelijanumero / Student number</Header>
        {user.studentNumber}
      </div>
      <div>
        <Header as="h5">Yliopiston sähköposti / University email:</Header>
        {user.hyEmail}
      </div>
      <div>
        <Header as="h5">Henkilökohtainen sähköposti / Personal email:</Header>
        {user.personalEmail}
      </div>
      <div>
        <Header as="h5">Opinto-ohjelma(t) / Study Program(s):</Header>
        {user.studyPrograms.map(sp => sp.name).join(', ')}
      </div>
    </Segment>
  )
}

export default StudentInfo
