import React from 'react'
import { Button } from 'semantic-ui-react'
import VirtualizedTable from 'Components/VirtualizedTable'
import dateFormatter from 'Utilities/dateFormatter'
import { useDispatch } from 'react-redux'
import { updateStudentReclaimStatus } from 'Utilities/redux/studentReducer'

const ReclaimTable = ({ students }) => {
  const dispatch = useDispatch()

  const valOrEmpty = val => (val !== null ? val : '-')
  const boolToString = bool => (bool ? 'Kyllä' : 'Ei')
  const statusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'green'
      case 'CONTACTED':
        return 'orange'
      default:
        return 'red'
    }
  }

  const markReclaimStatusClosed = (studentNumber) => {
    const confirm = window.confirm(`Close case for ${studentNumber}? (This action cannot be undone.)`)
    if (confirm) dispatch(updateStudentReclaimStatus('CLOSED', studentNumber))
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      renderCell: ({ name }) => (
        <span>
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
      key: 'device_given_at',
      label: 'Device given at',
      renderCell: ({ deviceGivenAt }) => valOrEmpty(dateFormatter(deviceGivenAt)),
      getCellVal: ({ deviceGivenAt }) => new Date(deviceGivenAt).getTime(),
      width: 160,
    },
    {
      key: 'present',
      label: 'Present',
      renderCell: ({ present }) => boolToString(present),
      getCellVal: ({ present }) => !!present,
      width: 100,
    },
    {
      key: 'first_year_credits',
      label: 'Fresher year credits',
      renderCell: ({ firstYearCredits }) => valOrEmpty(firstYearCredits),
      getCellVal: ({ firstYearCredits }) => firstYearCredits,
      width: 200,
    },
    {
      key: 'reclaim_status',
      label: 'Status',
      renderCell: ({ reclaimStatus }) => <span style={{ color: statusColor(reclaimStatus), fontWeight: 550 }}>{valOrEmpty(reclaimStatus)}</span>,
      getCellVal: ({ reclaimStatus }) => reclaimStatus,
      width: 100,
    },
    {
      key: 'mark_closed',
      label: '',
      renderCell: ({
        studentNumber, reclaimStatus,
      }) => (
        <Button
          data-cy="markStatusClosed"
          disabled={reclaimStatus === 'CLOSED'}
          onClick={() => markReclaimStatusClosed(studentNumber)}
          color="blue"
          size="tiny"
        >
          Close
        </Button>
      ),
      disableSort: true,
      width: 100,
    },
  ]

  return (
    <VirtualizedTable
      searchable
      columns={columns}
      data={students}
      defaultCellWidth={125}
    />
  )
}

export default ReclaimTable
