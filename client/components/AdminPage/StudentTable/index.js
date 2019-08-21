import React from 'react'
import { Button } from 'semantic-ui-react'
import SortedTable from '../../SortedTable'

const StudentTable = () => {
  const headers = [
    {
      key: 'name',
      title: 'Name',
      getRowVal: () => 1,
    },
    {
      key: 'email',
      title: 'Email',
      getRowVal: () => 1,
    },
    {
      key: 'student_number',
      title: 'Student number',
      getRowVal: () => 1,
    },
    {
      key: 'eligible',
      title: 'Eligible',
      getRowVal: () => 1,
    },
    {
      key: 'digitaidot',
      title: 'Digi skills',
      getRowVal: () => 1,
      getRowContent: () => 1,
    },
    {
      key: 'device_given',
      title: 'Device given',
      getRowVal: () => 1,
      getRowContent: () => 1,
    },
    {
      key: 'device_id',
      title: 'Device id',
      getRowVal: () => 1,
      getRowContent: () => 1,
    },
    {
      key: 'device_distributed_by',
      title: 'Device distributed by',
      getRowVal: () => 1,
      getRowContent: () => 1,
    },
    {
      key: 'mark_eligible',
      title: '',
      getRowContent: () => <Button color="blue">Mark eligible</Button>,
      disabled: true,
    },
  ]

  const data = [
    { },
    { },
  ]

  return (
    <SortedTable
      getRowKey={() => Math.random() * 1000000}
      columns={headers}
      data={data}
    />
  )
}

export default StudentTable
