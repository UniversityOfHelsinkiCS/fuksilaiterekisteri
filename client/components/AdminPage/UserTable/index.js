import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Icon, Checkbox } from 'semantic-ui-react'
import {
  toggleStudentEligiblityAction, toggleUserRoleAction, markDeviceReturnedAction,
} from '../../../util/redux/usersReducer'
import dateFormatter from '../../../util/dateFormatter'
import VirtualizedTable from '../../VirtualizedTable'

const UserTable = ({
  users, handleAdminNoteClick, handleStaffSettingClick, hiddenColumns, filter,
}) => {
  const dispatch = useDispatch()
  const valOrEmpty = val => (val !== null ? val : '-')

  const toggleStudentEligibility = (studentNumber, name, eligible) => {
    const reason = window.prompt(`Please write down the reason for marking ${name} ${eligible ? 'Ineligible' : 'Eligible'}:`)
    if (reason) dispatch(toggleStudentEligiblityAction({ studentNumber, reason }))
  }

  const markDeviceReturned = (studentNumber) => {
    const confirm = window.confirm(`This will mark device as returned for student number ${studentNumber}`)
    if (confirm)dispatch(markDeviceReturnedAction(studentNumber))
  }

  const currentUser = useSelector(state => state.user.data)

  const toggleUserRole = (user, role) => {
    const displayName = user.name || user.studentNumber || user.hyEmail || user.id
    const editingPermissions = !['digiSkillsCompleted', 'courseRegistrationCompleted', 'wantsDevice'].includes(role)

    let msg
    if (editingPermissions) {
      msg = user[role] ? `Remove ${role} permissions from ${displayName}?` : `Give ${role} permissions to ${displayName}?`
    } else {
      msg = `Mark ${role} as ${(!user[role]).toString()} for user ${displayName}?`
    }

    const confirm = window.confirm(msg)
    if (confirm) dispatch(toggleUserRoleAction(user.id, role))
  }

  const toggleStaff = (user) => {
    if (user.staff) {
      const confirm = window.confirm(`Remove staff permission from ${user.name}?`)
      if (confirm) dispatch(toggleUserRoleAction(user.id, 'staff'))
    } else if (!user.staff && user.studyPrograms.length > 0) {
      const confirm = window.confirm(`Give staff permission from ${user.name}?`)
      if (confirm) dispatch(toggleUserRoleAction(user.id, 'staff'))
    } else {
      handleStaffSettingClick(user.id)
    }
  }

  const boolToString = bool => (bool ? 'Kyllä' : 'Ei')

  const loginAs = (userId) => {
    localStorage.setItem('adminLoggedInAs', userId)
    window.location.reload()
  }

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
      width: filter === 'allStaff' || filter === 'deviceHolders' ? 300 : 125,
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
      width: filter === 'allStaff' || filter === 'deviceHolders' ? 300 : 125,
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
      width: 80,
    },
    {
      key: 'digitaidot',
      label: 'Digi skills',
      renderCell: user => <Checkbox data-cy="toggleDigiskills" checked={!!user.digiSkillsCompleted} onChange={() => toggleUserRole(user, 'digiSkillsCompleted')} />,
      getCellVal: ({ digiSkillsCompleted }) => !!digiSkillsCompleted,
      width: 100,
    },
    {
      key: 'enrolled',
      label: 'Has enrolled',
      renderCell: user => <Checkbox data-cy="toggleHasEnrolled" checked={!!user.courseRegistrationCompleted} onChange={() => toggleUserRole(user, 'courseRegistrationCompleted')} />,
      getCellVal: ({ courseRegistrationCompleted }) => !!courseRegistrationCompleted,
      width: 130,
    },
    {
      key: 'wants_device',
      label: 'Wants device',
      renderCell: user => <Checkbox data-cy="toggleWantsDevice" checked={!!user.wantsDevice} onChange={() => toggleUserRole(user, 'wantsDevice')} />,
      getCellVal: ({ wantsDevice }) => !!wantsDevice,
      width: 130,
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
      key: 'device_returned_at',
      label: 'Returned at',
      renderCell: ({ deviceReturnedAt }) => valOrEmpty(dateFormatter(deviceReturnedAt)),
    },
    {
      key: 'device_returned_by',
      label: 'Returned by',
      renderCell: ({ deviceReturnedBy }) => valOrEmpty(deviceReturnedBy),
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
      renderCell: user => <Checkbox data-cy="toggleAdmin" disabled={currentUser.id === user.id} checked={!!user.admin} onChange={() => toggleUserRole(user, 'admin')} />,
      getCellVal: ({ admin }) => admin,
      width: 75,
    },
    {
      key: 'staff',
      label: 'Staff',
      renderCell: user => (
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Checkbox data-cy="toggleStaff" checked={!!user.staff} onChange={() => toggleStaff(user)} />
          <Icon
            name="setting"
            data-cy="staffSettings"
            onClick={() => handleStaffSettingClick(user.id)}
            style={{ marginLeft: '0.3em', cursor: 'pointer' }}
          />
        </div>
      ),
      getCellVal: ({ staff }) => staff,
      width: 75,
    },
    {
      key: 'distributor',
      label: 'Distributor',
      renderCell: user => <Checkbox data-cy="toggleDistributor" checked={!!user.distributor} onChange={() => toggleUserRole(user, 'distributor')} />,
      getCellVal: ({ distributor }) => distributor,
      width: 125,
    },
    {
      key: 'reclaimer',
      label: 'Reclaimer',
      renderCell: user => <Checkbox data-cy="toggleReclaimer" checked={!!user.reclaimer} onChange={() => toggleUserRole(user, 'reclaimer')} />,
      getCellVal: ({ reclaimer }) => reclaimer,
      width: 125,
    },
    {
      key: 'mark_eligible',
      label: '',
      renderCell: ({ studentNumber, eligible, name }) => (
        <Button disabled={!studentNumber} onClick={() => toggleStudentEligibility(studentNumber, name, eligible)} color={eligible ? 'red' : 'blue'}>
          {eligible ? 'Mark ineligible' : 'Mark eligible'}
        </Button>
      ),
      disableSort: true,
      width: 180,
    },
    {
      key: 'mark_returned',
      label: '',
      renderCell: ({
        studentNumber, deviceReturned, deviceGivenAt,
      }) => (
        <Button data-cy="markDeviceReturned" disabled={!studentNumber || deviceReturned || !deviceGivenAt} onClick={() => markDeviceReturned(studentNumber)} color="blue">
          Mark device as returned
        </Button>
      ),
      disableSort: true,
      width: 250,
    },
  ]

  if (currentUser.superAdmin) {
    columns.push({
      key: 'login_as',
      label: '',
      renderCell: ({
        userId,
      }) => (
        <Button data-cy="loginAs" onClick={() => loginAs(userId)} color="blue">
        Login as
        </Button>
      ),
      disableSort: true,
      width: 110,
    })
  }

  const filteredColumns = columns.filter(({ key }) => !hiddenColumns.includes(key))

  return (
    <VirtualizedTable
      searchable
      columns={filteredColumns}
      data={users}
      defaultCellWidth={125}
    />
  )
}

export default UserTable
