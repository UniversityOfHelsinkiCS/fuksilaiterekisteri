import React from 'react'
import { Message } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { localeSelector } from 'Utilities/redux/localeReducer'

const translations = {
  notRegisteredToCourse: {
    en: 'You have not yet registered to a course on your study programme.\n\n'
      + 'Please plan your studies and register for courses in Weboodi. (The registration status is updated hourly.)',
    fi: 'Et ole vielä ilmoittautunut oman opintolinjasi kurssille. \n\n'
      + 'Suunnittele opintosi ja käy ilmoittautumassa kursseille Weboodissa. (Tämä tieto päivittyy tunneittain.)',
  },
  digiSkillsNotCompleted: {
    en: 'You are yet to complete the course Student\'s digital skills: Orientation (DIGI-A).\n\n'
      + '(The course is graded and registered on the week following the examination period, after which the completion will also be displayed here.)',
    fi: 'Et ole vielä suorittanut Opiskelijan digitaidot: orientaatio-kurssia (DIGI-A).\n\n'
      + '(Kurssin suoritukset kirjataan koejakson jälkeisellä viikolla, jonka jälkeen suoritus näkyy myös täällä.)',
  },
}

const TaskInfo = ({ courseRegistrationCompleted, digiSkillsCompleted }) => {
  const locale = useSelector(localeSelector)

  if (courseRegistrationCompleted && digiSkillsCompleted) return null
  return (
    <div style={{ padding: '1em' }}>
      {!courseRegistrationCompleted && <Message warning><ReactMarkdown source={translations.notRegisteredToCourse[locale]} /></Message>}
      {!digiSkillsCompleted && <Message warning><ReactMarkdown source={translations.digiSkillsNotCompleted[locale]} /></Message>}
    </div>
  )
}

export default TaskInfo
