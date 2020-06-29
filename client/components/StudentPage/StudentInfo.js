import React from 'react'
import { useSelector } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'
import { localeSelector } from 'Utilities/redux/localeReducer'

const translations = {
  name: {
    en: 'Name:',
    fi: 'Nimi:',
  },
  studentNumber: {
    en: 'Student number:',
    fi: 'Opiskelijanumero:',
  },
  universityEmail: {
    en: 'University email:',
    fi: 'Yliopiston sähköposti:',
  },
  personalEmail: {
    en: 'Personal email:',
    fi: 'Henkilökohtainen sähköposti:',
  },
  studyPrograms: {
    en: 'Study programs(s):',
    fi: 'Opinto-ohjelma(t):',
  },
  notGiven: {
    en: 'Not given',
    fi: 'Ei annettu',
  },
}

const getOs = (code) => {
  const cubbli = ['KH50_002', 'KH50_005', 'KH50_008']

  if (cubbli.includes(code)) {
    return <p style={{ marginLeft: '10px', fontWeight: 'bold', color: 'orange' }}>Cubbli</p>
  }
  return <p style={{ marginLeft: '10px', fontWeight: 'bold', color: 'blue' }}>Windows</p>
}

const StudentInfo = () => {
  const user = useSelector(state => state.user.data)
  const locale = useSelector(localeSelector)

  return (
    <Segment>
      <div>
        <Header as="h5">{translations.name[locale]}</Header>
        {user.name}
      </div>
      <br />
      <div>
        <Header as="h5">{translations.studentNumber[locale]}</Header>
        {user.studentNumber}
      </div>
      <br />
      <div>
        <Header as="h5">{translations.universityEmail[locale]}</Header>
        {user.hyEmail}
      </div>
      <br />
      <div>
        <Header as="h5">{translations.personalEmail[locale]}</Header>
        {user.personalEmail || translations.notGiven[locale]}
      </div>
      <br />
      <div>
        <Header as="h5">{translations.studyPrograms[locale]}</Header>
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
