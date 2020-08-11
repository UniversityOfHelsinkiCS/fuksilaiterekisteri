import React from 'react'
import { useSelector } from 'react-redux'
import { Segment, Icon, Header } from 'semantic-ui-react'
import { localeSelector } from 'Utilities/redux/localeReducer'
import TranslatedMarkdown from 'Components/TranslatedMarkdown'
import StudentInfo from './StudentInfo'
import TaskInfo from './TaskInfo'

const translations = {
  taskStatus: {
    en: 'Task status:',
    fi: 'Tehtävien tila:',
  },
  beFuksi: {
    en: 'Be a fresher',
    fi: 'Ole fuksi',
  },
  registeredToRelevant: {
    en: 'Registered to relevant course',
    fi: 'Rekisteröitynyt relevantille kurssille',
  },
  digiSkillsCompleted: {
    en: 'DIGI-A completed',
    fi: 'DIGI-A suoritettu',
  },
  tasksFinished: {
    en: 'You have completed the tasks required for fresher device. Info about device distribution will be sent to you by email.',
    fi: 'Olet suorittanut fuksilaitteeseen vaadittavat tehtävät. Saat tiedot laitteiden jakelusta sähköpostitse.',
  },
}

const Task = ({ task, completed }) => {
  if (completed) {
    return (
      <Segment style={{ background: '#d2f3db' }} textAlign="center">
        {task}
        <Icon name="checkmark" size="large" style={{ marginLeft: '10px' }} />
      </Segment>
    )
  }
  return (
    <Segment style={{ background: '#fddede' }} textAlign="center">
      {task}
      <Icon name="cancel" size="large" style={{ marginLeft: '10px' }} />
    </Segment>
  )
}

const fake = {
  user: {
    eligible: true,
    courseRegistrationCompleted: true,
    digiSkillsCompleted: true,
  },
}

const StudentStatusPage = ({ faking }) => {
  const user = faking ? fake.user : useSelector(state => state.user.data)
  const locale = useSelector(localeSelector)

  return (
    <Segment.Group>
      <StudentInfo faking={faking} />
      <Segment>
        <Header as="h3" data-cy="taskStatus">{translations.taskStatus[locale]}</Header>
        <Segment.Group horizontal>
          <Task task={translations.beFuksi[locale]} completed={user.eligible} />
          <Task
            task={translations.registeredToRelevant[locale]}
            completed={user.courseRegistrationCompleted}
          />
          <Task
            task={translations.digiSkillsCompleted[locale]}
            completed={user.digiSkillsCompleted}
          />
        </Segment.Group>
      </Segment>
      <TaskInfo
        courseRegistrationCompleted={user.courseRegistrationCompleted}
        digiSkillsCompleted={user.digiSkillsCompleted}
      />
      <Segment>
        <TranslatedMarkdown textKey="distributionInfo" />
      </Segment>
      <Segment>
        <TranslatedMarkdown textKey="deviceSpecs" />
      </Segment>
    </Segment.Group>
  )
}

export default StudentStatusPage
