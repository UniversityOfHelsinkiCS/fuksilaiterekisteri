import React, { useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'
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

  const [userModalOpen, setUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(undefined)

  const updateStatus = (newStatus) => {
    const confirm = window.confirm(`Set status to ${newStatus} for ${selectedUser.name}? (This action cannot be undone.)`)
    if (confirm) {
      dispatch(updateStudentReclaimStatus(newStatus, selectedUser.studentNumber))
      setSelectedUser(undefined)
      setUserModalOpen(false)
    }
  }

  const handleSetStatusClick = (student) => {
    setSelectedUser(student)
    setUserModalOpen(true)
  }

  const ManualStatusUpdateModal = () => {
    if (!selectedUser) return null

    return (
      <Modal closeIcon onClose={() => setUserModalOpen(false)} open={userModalOpen}>
        <Modal.Header>{`Updating status of ${selectedUser.name}`}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            {`Current status: ${selectedUser.reclaimStatus}`}
            <br />
            {`Student number: ${selectedUser.studentNumber}`}

            <div style={{ marginTop: '1em' }}>
              <Button disabled={selectedUser.reclaimStatus === 'CONTACTED'} color="orange" onClick={() => updateStatus('CONTACTED')}>Set as Contacted</Button>
              <Button disabled={selectedUser.reclaimStatus === 'CLOSED'} color="red" onClick={() => updateStatus('CLOSED')}>Set as Closed</Button>
            </div>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
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
      renderCell: ({ firstYearCredits, thirdYearOrLaterStudent }) => (thirdYearOrLaterStudent ? '3rd+ year student' : valOrEmpty(firstYearCredits)),
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
      key: 'set_status_manually',
      label: 'Set status manually',
      renderCell: student => (
        <Button
          disabled={student.reclaimStatus === 'CLOSED'}
          data-cy="setStatusManually"
          onClick={() => handleSetStatusClick(student)}
          color="blue"
          size="tiny"
        >
          Set status manually
        </Button>
      ),
      disableSort: true,
      width: 200,
    },
  ]

  return (
    <>
      <VirtualizedTable
        searchable
        columns={columns}
        data={students}
        defaultCellWidth={125}
      />
      <ManualStatusUpdateModal />
    </>
  )
}

export default ReclaimTable
