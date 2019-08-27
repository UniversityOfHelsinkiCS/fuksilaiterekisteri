import React from 'react'
import { useDispatch } from 'react-redux'
import {
  Button,
} from 'semantic-ui-react'
import SortedTable from '../../SortedTable'
import { updateStudentStatus, markStudentEligible } from '../../../util/redux/studentReducer'

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

  const handleEligibleUpdate = (studentNumber) => {
    confirm(
      () => dispatch(markStudentEligible({ studentNumber })),
      `Are you sure you want to make ${studentNumber} eligible?`,
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
      key: 'email',
      title: 'Email',
      getRowVal: ({ hyEmail, personalEmail }) => (
        <span>
          {hyEmail}
          <br />
          {personalEmail}
        </span>
      ),
    },
    {
      key: 'eligible',
      title: 'Eligible',
      getRowVal: ({ eligible }) => boolToString(eligible),
    },
    {
      key: 'digitaidot',
      title: 'Digi skills',
      getRowVal: ({ digiSkillsCompleted, studentNumber }) => (
        <>
          {boolToString(digiSkillsCompleted)}
          {' '}
          {!digiSkillsCompleted && <Button onClick={() => handleDigiSkillsUpdate(studentNumber)} size="tiny" color="blue" icon="plus" />}
        </>
      ),
    },
    {
      key: 'enrolled',
      title: 'Has enrolled',
      getRowVal: ({ courseRegistrationCompleted, studentNumber }) => (
        <>
          {boolToString(courseRegistrationCompleted)}
          {' '}
          {!courseRegistrationCompleted && <Button onClick={() => handleEnrolledUpdate(studentNumber)} size="tiny" color="blue" icon="plus" />}
        </>
      ),
    },
    {
      key: 'device_given',
      title: 'Device given',
      getRowVal: ({ deviceGivenAt }) => boolToString(!!deviceGivenAt),
    },
    {
      key: 'wants_device',
      title: 'Wants device',
      getRowVal: ({ wantsDevice }) => boolToString(wantsDevice),
    },
    {
      key: 'studyPrograms',
      title: 'Study programs',
      getRowVal: ({ studyPrograms }) => studyPrograms.map(s => s.code).join(', '),
    },
    {
      key: 'mark_eligible',
      title: '',
      getRowContent: ({ studentNumber, eligible }) => <Button disabled={eligible} onClick={() => handleEligibleUpdate(studentNumber)} color="blue">Mark eligible</Button>,
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
