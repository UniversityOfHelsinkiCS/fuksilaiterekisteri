import React from 'react'
import { Segment } from 'semantic-ui-react'

const RegistrationInfo = () => (
  <Segment style={{ maxWidth: '500px' }}>
    Et ole vielä ilmoittautunut oman opintolinjasi kurssille. Suunnittele
    opintosi ja käy ilmoittautumassa kursseille Weboodissa. (Tämä tieto
    päivittyy tunneittain.)
    <br />
    <br />
    You have not yet registered to a course on your study programme. Please plan
    your studies and register for courses in Weboodi. (The registration status
    is updated hourly.)
  </Segment>
)

const DigiskillsInfo = () => (
  <Segment style={{ maxWidth: '500px' }}>
    Et ole vielä suorittanut Opiskelijan digitaidot: orientaatio-kurssia (DIGI-XXXA). (Kurssin suoritukset merkitään koejaksoa seuraavalla
    viikolla, jonka jälkeen suoritus näkyy myös täällä.)
    <br />
    <br />
    You are yet to complete the course Student&apos;s digital skills:
    Orientation (DIGI-XXXA). (Please note that this course is graded
    only after its test period ends, so there may be a long delay before the
    credit is registered.)
  </Segment>
)

const TaskInfo = ({ courseRegistrationCompleted, digiSkillsCompleted }) => {
  if (courseRegistrationCompleted && digiSkillsCompleted) return null
  return (
    <Segment.Group>
      {courseRegistrationCompleted ? null : <RegistrationInfo />}
      {digiSkillsCompleted ? null : <DigiskillsInfo />}
    </Segment.Group>
  )
}

export default TaskInfo
