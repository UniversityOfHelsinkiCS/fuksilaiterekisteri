import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Icon, Checkbox } from 'semantic-ui-react'
import { markStudentEligible as markStudentEligibleAction, toggleUserStaff as toggleUserStaffAction, toggleUserDistributor as toggleUserDistributorAction } from '../../../util/redux/usersReducer'
import dateFormatter from '../../../util/dateFormatter'
import VirtualizedTable from '../../VirtualizedTable'

const UserTable = ({ users, handleAdminNoteClick }) => {
  const dispatch = useDispatch()
  const valOrEmpty = val => (val !== null ? val : '-')
  const markStudentEligible = (studentNumber, name) => {
    const reason = window.prompt(`Please write down the reason ${name} is marked eligible:`)
    if (reason) dispatch(markStudentEligibleAction({ studentNumber, reason }))
  }
  const toggleUserStaff = id => dispatch(toggleUserStaffAction(id))
  const toggleUserDistributor = id => dispatch(toggleUserDistributorAction(id))
  const boolToString = bool => (bool ? 'Kyllä' : 'Ei')

  const columns = [
    {
      key: 'name',
      label: 'Name',
      renderCell: ({ id, name, adminNote }) => (
        <span>
          <Icon onClick={() => handleAdminNoteClick(id)} style={{ cursor: 'pointer' }} color={`${adminNote ? 'green' : 'black'}`} name={`${adminNote ? 'sticky note' : 'sticky note outline'}`} />
          {valOrEmpty(name)}
        </span>
      ),
      getCellVal: ({ name }) => valOrEmpty(name),
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
      key: 'student_number',
      label: 'Student number',
      renderCell: ({ studentNumber }) => valOrEmpty(studentNumber),
      width: 180,
    },
    {
      key: 'studyPrograms',
      label: 'Study programs',
      renderCell: ({ studyPrograms }) => valOrEmpty(studyPrograms.map(s => s.name).join(', ') || null),
      width: 180,
    },
    {
      key: 'eligible',
      label: 'Eligible',
      renderCell: ({ eligible }) => boolToString(eligible),
      getCellVal: ({ eligible }) => eligible,
    },
    {
      key: 'digitaidot',
      label: 'Digi skills',
      renderCell: ({ digiSkillsCompleted }) => boolToString(digiSkillsCompleted),
    },
    {
      key: 'enrolled',
      label: 'Has enrolled',
      renderCell: ({ courseRegistrationCompleted }) => boolToString(courseRegistrationCompleted),
    },
    {
      key: 'wants_device',
      label: 'Wants device',
      renderCell: ({ wantsDevice }) => boolToString(wantsDevice),
    },
    {
      key: 'device_given_at',
      label: 'Device given at',
      renderCell: ({ deviceGivenAt }) => valOrEmpty(dateFormatter(deviceGivenAt)),
      getCellVal: ({ deviceGivenAt }) => new Date(deviceGivenAt).getTime(),
      width: 160,
    },
    {
      key: 'device_id',
      label: 'Device id',
      renderCell: ({ deviceSerial }) => valOrEmpty(deviceSerial),
    },
    {
      key: 'device_distributed_by',
      label: 'Device distributed by',
      renderCell: ({ device_distributed_by }) => valOrEmpty(device_distributed_by),
      width: 220,
    },
    {
      key: 'admin',
      label: 'Admin',
      renderCell: ({ admin }) => <Checkbox checked={!!admin} disabled />,
      getCellVal: ({ admin }) => admin,
      width: 75,
    },
    {
      key: 'staff',
      label: 'Staff',
      renderCell: ({ staff, id }) => <Checkbox checked={!!staff} onChange={() => toggleUserStaff(id)} />,
      getCellVal: ({ staff }) => boolToString(staff),
      width: 75,
    },
    {
      key: 'distributor',
      label: 'Distributor',
      renderCell: ({ distributor, id }) => <Checkbox checked={!!distributor} onChange={() => toggleUserDistributor(id)} />,
      getCellVal: ({ distributor }) => distributor,
      width: 125,
    },
    {
      key: 'mark_eligible',
      label: '',
      renderCell: ({ studentNumber, eligible, name }) => (
        <Button disabled={eligible || !studentNumber} onClick={() => markStudentEligible(studentNumber, name)} color="blue">
          Mark eligible
        </Button>
      ),
      disableSort: true,
      width: 180,
    },
  ]

  return (
    <VirtualizedTable
      searchable
      columns={columns}
      data={users}
      defaultCellWidth={125}
    />
  )
}

export default UserTable
