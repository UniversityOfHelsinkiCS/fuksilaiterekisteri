import React from 'react'
import { useDispatch } from 'react-redux'
import {
  Button,
} from 'semantic-ui-react'
import SortedTable from '../../SortedTable'
import { updateStudentStatus } from '../../../util/redux/studentReducer'

const StudentTable = ({ students }) => {
  const dispatch = useDispatch()
  const boolToString = bool => (bool ? 'Kyllä' : 'Ei')

  const confirm = (func, msg) => {
    const res = window.confirm(msg)
    if (res) func()
  }

  const handleDigiSkillsUpdate = (studentNumber) => {
    confirm(
      () => dispatch(updateStudentStatus({ studentNumber, digiSkills: true })),
      `Are you sure you want to add digi skills completed to ${studentNumber}?`,
    )
  }

  const handleEnrolledUpdate = (studentNumber) => {
    confirm(
      () => dispatch(updateStudentStatus({ studentNumber, enrolled: true })),
      `Are you sure you want to mark ${studentNumber} enrolled for courses?`,
    )
  }

  const headers = [
    {
      key: 'name',
      title: 'Name',
      getRowVal: ({ name }) => name,
    },
    {
      key: 'student_number',
      title: 'Student number',
      getRowVal: ({ studentNumber }) => studentNumber,
    },
    {
      key: 'digitaidot',
      title: 'Digi skills',
      getRowVal: ({ digiSkillsCompleted }) => boolToString(digiSkillsCompleted),
    },
    {
      key: 'enrolled',
      title: 'Has enrolled',
      getRowVal: ({ courseRegistrationCompleted }) => boolToString(courseRegistrationCompleted),
    },
    {
      key: 'studyPrograms',
      title: 'Study programs',
      getRowVal: ({ studyPrograms }) => studyPrograms.map(s => s.code).join(', '),
    },
    {
      key: 'mark_digi_skills',
      title: '',
      getRowContent: ({ studentNumber, digiSkillsCompleted }) => <Button disabled={digiSkillsCompleted} onClick={() => handleDigiSkillsUpdate(studentNumber)} color="blue">Mark digi skills</Button>,
      disabled: true,
    },
    {
      key: 'mark_enrolled',
      title: '',
      getRowContent: ({ studentNumber, courseRegistrationCompleted }) => <Button disabled={courseRegistrationCompleted} onClick={() => handleEnrolledUpdate(studentNumber)} color="blue">Mark enrolled</Button>,
      disabled: true,
    },
  ]
  return (
    <SortedTable
      getRowKey={({ id }) => id}
      columns={headers}
      data={students}
    />
  )
}

export default StudentTable
