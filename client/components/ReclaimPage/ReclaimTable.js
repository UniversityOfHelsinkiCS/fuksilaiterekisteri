import React from 'react'
import VirtualizedTable from 'Components/VirtualizedTable'
import dateFormatter from 'Utilities/dateFormatter'

const ReclaimTable = ({ students }) => {
  const valOrEmpty = val => (val !== null ? val : '-')
  const boolToString = bool => (bool ? 'Kyllä' : 'Ei')

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
      width: 80,
    },
    {
      key: 'first_year_credits',
      label: 'Fresher year credits',
      renderCell: ({ firstYearCredits }) => valOrEmpty(firstYearCredits),
      getCellVal: ({ firstYearCredits }) => firstYearCredits,
      width: 200,
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
