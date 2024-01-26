import React from 'react'
import { Segment } from 'semantic-ui-react'
import TranslatedMarkdown from 'Components/TranslatedMarkdown'
import StudentInfo from './StudentInfo'
// import TaskInfo from './TaskInfo'

const StudentStatusPage = ({ faking }) => (
  <Segment.Group>
    <StudentInfo faking={faking} />
    {/* <TaskInfo
        courseRegistrationCompleted={user.courseRegistrationCompleted}
        digiSkillsCompleted={user.digiSkillsCompleted}
      /> */}
    <Segment>
        You will get an email when the device is ready!
    </Segment>
    <Segment>
      <TranslatedMarkdown textKey="deviceSpecs" />
    </Segment>
  </Segment.Group>
)

export default StudentStatusPage
