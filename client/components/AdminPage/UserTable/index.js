import React from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
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
      getRowVal: ({ hyEmail }) => valOrEmpty(hyEmail),
    },
    {
      key: 'student_number',
      title: 'Student number',
      getRowVal: ({ studentNumber }) => valOrEmpty(studentNumber),
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
      key: 'staff',
      title: 'Staff',
      getRowVal: ({ staff }) => boolToString(staff),
    },
    {
      key: 'distributor',
      title: 'Distributor',
      getRowVal: ({ distributor }) => boolToString(distributor),
    },
    {
      key: 'mark_eligible',
      title: '',
      getRowContent: ({ studentNumber, eligible, name }) => <Button disabled={eligible} onClick={() => markStudentEligible(studentNumber, name)} color="blue">Mark eligible</Button>,
      disabled: true,
    },
    {
      key: 'toggle_staff',
      title: '',
      getRowContent: ({ id }) => <Button color="blue" onClick={() => toggleUserStaff(id)}>Toggle staff</Button>,
      disabled: true,
    },
    {
      key: 'toggle_distributor',
      title: '',
      getRowContent: ({ id }) => <Button color="blue" onClick={() => toggleUserDistributor(id)}>Toggle distributor</Button>,
      disabled: true,
    },
  ]

  console.log('users', users)

  return (
    <SortedTable
      getRowKey={() => Math.random() * 1000000}
      columns={headers}
      data={users}
    />
  )
}

export default UserTable
