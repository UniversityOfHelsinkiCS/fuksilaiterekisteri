import React from 'react'
import { useDispatch } from 'react-redux'
import {
  Button,
} from 'semantic-ui-react'
import {
  markStudentEligible as markStudentEligibleAction,
  toggleUserStaff as toggleUserStaffAction,
  toggleUserDistributor as toggleUserDistributorAction,
} from '../../../util/redux/usersReducer'
import SortedTable from '../../SortedTable'

const UserTable = ({ users }) => {
  const dispatch = useDispatch()
  const valOrEmpty = val => (val !== null ? val : '-')
  const markStudentEligible = (studentNumber, name) => {
    const res = window.confirm(`Are you sure you want to mark ${name} eligible?`)
    if (res) dispatch(markStudentEligibleAction(studentNumber))
  }
  const toggleUserStaff = id => dispatch(toggleUserStaffAction(id))
  const toggleUserDistributor = id => dispatch(toggleUserDistributorAction(id))
  const boolToString = bool => (bool ? 'Kyllä' : 'Ei')

  const headers = [
    {
      key: 'name',
      title: 'Name',
      getRowVal: ({ name }) => valOrEmpty(name),
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
      key: 'student_number',
      title: 'Student number',
      getRowVal: ({ studentNumber }) => valOrEmpty(studentNumber),
    },
    {
      key: 'studyPrograms',
      title: 'Study programs',
      getRowVal: ({ studyPrograms }) => studyPrograms.map(s => s.code).join(', '),
    },
    {
      key: 'eligible',
      title: 'Eligible',
      getRowVal: ({ eligible }) => boolToString(eligible),
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
      key: 'wants_device',
      title: 'Wants device',
      getRowVal: ({ wantsDevice }) => boolToString(wantsDevice),
    },
    {
      key: 'device_given',
      title: 'Device given',
      getRowVal: ({ deviceGivenAt }) => boolToString(!!deviceGivenAt),
    },
    {
      key: 'device_id',
      title: 'Device id',
      getRowVal: ({ deviceSerial }) => valOrEmpty(deviceSerial),
    },
    {
      key: 'device_distributed_by',
      title: 'Device distributed by',
      getRowVal: ({ device_distributed_by }) => valOrEmpty(device_distributed_by),
    },
    {
      key: 'admin',
      title: 'admin',
      getRowVal: ({ admin }) => boolToString(admin),
    },
    {
      key: 'staff',
      title: 'Staff',
      getRowVal: ({ staff }) => staff,
      getRowContent: ({ staff, id }) => (
        <>
          {boolToString(staff)}
          {' '}
          <Button color="blue" icon="refresh" onClick={() => toggleUserStaff(id)} />
        </>
      ),
    },
    {
      key: 'distributor',
      title: 'Distributor',
      getRowVal: ({ distributor }) => distributor,
      getRowContent: ({ distributor, id }) => (
        <>
          {boolToString(distributor)}
          {' '}
          <Button color="blue" icon="refresh" onClick={() => toggleUserDistributor(id)} />
        </>
      ),
    },
    {
      key: 'mark_eligible',
      title: '',
      getRowContent: ({ studentNumber, eligible, name }) => <Button disabled={eligible || !studentNumber} onClick={() => markStudentEligible(studentNumber, name)} color="blue">Mark eligible</Button>,
      disabled: true,
    },
  ]

  return (
    <div style={{ maxWidth: '100%' }}>
      <SortedTable
        getRowKey={({ id }) => id}
        columns={headers}
        data={users}
      />
    </div>
  )
}

export default UserTable
