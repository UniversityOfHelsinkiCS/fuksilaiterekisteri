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
  studyprogrammeContact: {
    fi: 'Yhteyshenkilö',
    en: 'Contact Person',
  },
  notSet: {
    en: 'Not set',
    fi: 'Ei määritelty',
  },
}

const getOs = (code) => {
  const cubbli = ['KH50_002', 'KH50_005', 'KH50_008']

  if (cubbli.includes(code)) {
    return <span style={{ marginLeft: '10px', fontWeight: 'bold', color: 'orange' }}>Cubbli</span>
  }
  return <span style={{ marginLeft: '10px', fontWeight: 'bold', color: 'blue' }}>Windows</span>
}

const fake = {
  user: {
    name: 'fake',
    studentNumber: 'fake',
    hyEmail: 'fake',
    personalEmail: 'fake',
    studyPrograms: [{ name: 'fakeprogram', code: 'fakecode' }],
  },
}

const StudentInfo = ({ faking }) => {
  const user = faking ? fake.user : useSelector(state => state.user.data)
  const locale = useSelector(localeSelector)

  const valOrLocalizedError = param => (param || translations.notSet[locale])

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
        {user.studyPrograms.map(({
          code, name, contactName, contactEmail,
        }) => (
          <div key={code} style={{ padding: '0.5em 0em' }}>
            <span>{`- ${name}, ${code} `}</span>
            {getOs(code)}
            <p>{`${translations.studyprogrammeContact[locale]}: ${valOrLocalizedError(contactName)}, ${valOrLocalizedError(contactEmail)}`}</p>
          </div>
        ))}
      </div>
    </Segment>
  )
}

export default StudentInfo
