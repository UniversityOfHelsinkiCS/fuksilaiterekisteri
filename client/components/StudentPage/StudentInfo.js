import React from 'react'
import { useSelector } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'

const getOs = (code) => {
  const cubbli = ['KH50_002', 'KH50_005']

  if (cubbli.includes(code)) {
    return <p style={{ marginLeft: '10px', fontWeight: 'bold', color: 'orange' }}>Cubbli</p>
  }
  return <p style={{ marginLeft: '10px', fontWeight: 'bold', color: 'blue' }}>Windows</p>
}

const StudentInfo = () => {
  const user = useSelector(state => state.user.data)

  return (
    <Segment>
      <div>
        <Header as="h5">Nimi / Name:</Header>
        {user.name}
      </div>
      <br />
      <div>
        <Header as="h5">Opiskelijanumero / Student number:</Header>
        {user.studentNumber}
      </div>
      <br />
      <div>
        <Header as="h5">Yliopiston sähköposti / University email:</Header>
        {user.hyEmail}
      </div>
      <br />
      <div>
        <Header as="h5">Henkilökohtainen sähköposti / Personal email:</Header>
        {user.personalEmail || 'Ei annettu / Not given'}
      </div>
      <br />
      <div>
        <Header as="h5">Opinto-ohjelma(t) / Study Program(s):</Header>
        {user.studyPrograms.map(({ code, name }) => (
          <div key={code} style={{ display: 'flex' }}>
            <p>{`- ${name}, ${code}`}</p>
            {getOs(code)}
          </div>
        ))}
      </div>
    </Segment>
  )
}

export default StudentInfo
