import React from 'react'
import { useDispatch } from 'react-redux'
import {
  Button,
} from 'semantic-ui-react'
import dateFormatter from '../../../util/dateFormatter'
import VirtualizedTable from '../../VirtualizedTable'
import { updateStudentStatus, markStudentEligible } from '../../../util/redux/studentReducer'

const StudentTable = ({ students }) => {
  const dispatch = useDispatch()
  const boolToString = bool => (bool ? 'Kyllä' : 'Ei')
  const valOrEmpty = val => (val !== null ? val : '-')

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
    const reason = window.prompt(`Please write down the reason ${studentNumber} is marked eligible:`)
    if (reason) dispatch(markStudentEligible({ studentNumber, reason }))
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      renderCell: ({ name }) => name,
    },
    {
      key: 'student_number',
      label: 'Student number',
      renderCell: ({ studentNumber }) => studentNumber,
      width: 180,
    },
    {
      key: 'email',
      label: 'Email',
      renderCell: ({ hyEmail, personalEmail }) => (
        <span>
          {hyEmail}
          <br />
          {personalEmail}
        </span>
      ),
      getCellVal: ({ hyEmail }) => hyEmail,
    },
    {
      key: 'eligible',
      label: 'Eligible',
      renderCell: ({ eligible }) => boolToString(eligible),
    },
    {
      key: 'digitaidot',
      label: 'Digi skills',
      getCellVal: ({ digiSkillsCompleted }) => digiSkillsCompleted,
      renderCell: ({ digiSkillsCompleted, studentNumber }) => (
        <>
          {boolToString(digiSkillsCompleted)}
          {' '}
          {!digiSkillsCompleted && <Button onClick={() => handleDigiSkillsUpdate(studentNumber)} size="tiny" color="blue" icon="plus" />}
        </>
      ),
    },
    {
      key: 'enrolled',
      label: 'Has enrolled',
      getCellVal: ({ courseRegistrationCompleted }) => courseRegistrationCompleted,
      renderCell: ({ courseRegistrationCompleted, studentNumber }) => (
        <>
          {boolToString(courseRegistrationCompleted)}
          {' '}
          {!courseRegistrationCompleted && <Button onClick={() => handleEnrolledUpdate(studentNumber)} size="tiny" color="blue" icon="plus" />}
        </>
      ),
    },
    {
      key: 'device_given_at',
      label: 'Device given at',
      renderCell: ({ deviceGivenAt }) => valOrEmpty(dateFormatter(deviceGivenAt)),
      getCellVal: ({ deviceGivenAt }) => new Date(deviceGivenAt).getTime(),
      width: 150,
    },
    {
      key: 'wants_device',
      label: 'Wants device',
      renderCell: ({ wantsDevice }) => boolToString(wantsDevice),
    },
    {
      key: 'studyPrograms',
      label: 'Study programs',
      renderCell: ({ studyPrograms }) => studyPrograms.map(s => s.name).join(', '),
      width: 200,
    },
    {
      key: 'mark_eligible',
      label: '',
      renderCell: ({ studentNumber, eligible }) => <Button disabled={eligible} onClick={() => handleEligibleUpdate(studentNumber)} color="blue">Mark eligible</Button>,
      disabled: true,
    },
  ]

  return (
    <VirtualizedTable
      searchable
      columns={columns}
      data={students}
      defaultCellWidth={150}
    />
  )
}

export default StudentTable
