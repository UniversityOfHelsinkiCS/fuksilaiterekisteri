import React from 'react'
import VirtualizedTable from 'Components/VirtualizedTable'
import dateFormatter from 'Utilities/dateFormatter'

const ReclaimTable = ({ students }) => {
  const valOrEmpty = val => (val !== null ? val : '-')

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
