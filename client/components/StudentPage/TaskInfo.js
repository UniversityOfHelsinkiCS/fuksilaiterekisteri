import React from 'react'
import { Segment } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { localeSelector } from 'Utilities/redux/localeReducer'

const translations = {
  notRegisteredToCourse: {
    en: 'You have not yet registered to a course on your study programme. '
      + 'Please plan your studies and register for courses in Weboodi. (The registration status is updated hourly.)',
    fi: 'Et ole vielä ilmoittautunut oman opintolinjasi kurssille. Suunnittele '
      + 'opintosi ja käy ilmoittautumassa kursseille Weboodissa. (Tämä tieto päivittyy tunneittain.)',
  },
  digiSkillsNotCompleted: {
    en: 'You are yet to complete the course Student\'s digital skills: '
      + 'Orientation (DIGI-A). (Please note that this course is graded '
      + 'only after its test period ends, so there may be a long delay before the '
      + 'credit is registered.)',
    fi: 'Et ole vielä suorittanut Opiskelijan digitaidot: orientaatio-kurssia (DIGI-A). '
      + '(Kurssin suoritukset kirjataan noin 1-2 viikkoa koejakson jälkeen, jonka jälkeen suoritus näkyy myös täällä.)',
  },
}

const TaskInfo = ({ courseRegistrationCompleted, digiSkillsCompleted }) => {
  const locale = useSelector(localeSelector)

  if (courseRegistrationCompleted && digiSkillsCompleted) return null
  return (
    <Segment.Group>
      {!courseRegistrationCompleted && <Segment style={{ maxWidth: '500px' }}>{translations.notRegisteredToCourse[locale]}</Segment>}
      {!digiSkillsCompleted && <Segment style={{ maxWidth: '500px' }}>{translations.digiSkillsNotCompleted[locale]}</Segment>}
    </Segment.Group>
  )
}

export default TaskInfo
