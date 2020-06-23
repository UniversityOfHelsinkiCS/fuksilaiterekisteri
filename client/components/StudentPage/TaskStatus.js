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
  registeredToRelevant: {
    en: 'Registered to relevant course',
    fi: 'Rekisteröitynyt relevantille kurssille',
  },
  digiSkillsCompleted: {
    en: 'DIGI-XXXA completed',
    fi: 'DIGI-XXXA suoritettu',
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

const StudentStatusPage = () => {
  const user = useSelector(state => state.user.data)
  const locale = useSelector(localeSelector)

  const showClaimingInfo = user.eligible && user.digiSkillsCompleted && user.courseRegistrationCompleted

  return (
    <Segment.Group>
      <StudentInfo />
      <Segment>
        <Header as="h3">{translations.taskStatus[locale]}</Header>
        <Segment.Group horizontal>
          <Task task="True Fuksi" completed={user.eligible} />
          <Task
            task={translations.registeredToRelevant[locale]}
            completed={user.courseRegistrationCompleted}
          />
          <Task
            task={translations.digiSkillsCompleted[locale]}
            completed={user.digiSkillsCompleted}
          />
        </Segment.Group>
        {showClaimingInfo
          && (
            <Segment>
              <div>{translations.tasksFinished[locale]}</div>
            </Segment>
          )
        }
      </Segment>
      <TaskInfo
        courseRegistrationCompleted={user.courseRegistrationCompleted}
        digiSkillsCompleted={user.digiSkillsCompleted}
      />
      <Segment>
        <TranslatedMarkdown textKey="deviceSpecs" />
      </Segment>
    </Segment.Group>
  )
}

export default StudentStatusPage
