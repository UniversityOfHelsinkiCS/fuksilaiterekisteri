import React, { useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import VirtualizedTable from 'Components/VirtualizedTable'
import dateFormatter from 'Utilities/dateFormatter'
import { useDispatch } from 'react-redux'
import { updateReclaimCaseStatusAction } from 'Utilities/redux/reclaimCaseReducer'

const ReclaimTable = ({ reclaimCases }) => {
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
  const [selectedCase, setSelectedCase] = useState(undefined)

  const updateStatus = (newStatus) => {
    const confirm = window.confirm(`Set status to ${newStatus} for ${selectedCase.student.name}? (This action cannot be undone.)`)
    if (confirm) {
      dispatch(updateReclaimCaseStatusAction(newStatus, selectedCase.id))
      setSelectedCase(undefined)
      setUserModalOpen(false)
    }
  }

  const handleSetStatusClick = (reclaimCase) => {
    setSelectedCase(reclaimCase)
    setUserModalOpen(true)
  }

  const ManualStatusUpdateModal = () => {
    if (!selectedCase) return null

    return (
      <Modal closeIcon onClose={() => setUserModalOpen(false)} open={userModalOpen}>
        <Modal.Header>{`Updating status of ${selectedCase.student.name}`}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            {`Current status: ${selectedCase.status}`}
            <br />
            {`Student number: ${selectedCase.student.studentNumber}`}

            <div style={{ marginTop: '1em' }}>
              <Button disabled={selectedCase.status === 'CONTACTED'} color="orange" onClick={() => updateStatus('CONTACTED')}>Set as Contacted</Button>
              <Button disabled={selectedCase.status === 'CLOSED'} color="red" onClick={() => updateStatus('CLOSED')}>Set as Closed</Button>
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
      renderCell: ({ student: { name } }) => (
        <span>
          {valOrEmpty(name)}
        </span>
      ),
      getCellVal: ({ student: { name } }) => valOrEmpty(name),
    },
    {
      key: 'email',
      label: 'Email',
      renderCell: ({ student: { hyEmail, personalEmail } }) => (
        <span>
          {hyEmail}
          <br />
          {personalEmail}
        </span>
      ),
      getCellVal: ({ student: { hyEmail } }) => hyEmail,
    },
    {
      key: 'student_number',
      label: 'Student number',
      renderCell: ({ student: { studentNumber } }) => valOrEmpty(studentNumber),
      width: 180,
    },
    {
      key: 'device_given_at',
      label: 'Device given at',
      renderCell: ({ student: { deviceGivenAt } }) => valOrEmpty(dateFormatter(deviceGivenAt)),
      getCellVal: ({ student: { deviceGivenAt } }) => new Date(deviceGivenAt).getTime(),
      width: 160,
    },
    {
      key: 'present',
      label: 'Present',
      renderCell: ({ absent }) => boolToString(!absent),
      getCellVal: ({ absent }) => !absent,
      width: 100,
    },
    {
      key: 'first_year_credits',
      label: 'Fresher year credits',
      renderCell: ({ student: { firstYearCredits } }) => valOrEmpty(firstYearCredits),
      getCellVal: ({ student: { firstYearCredits } }) => firstYearCredits,
      width: 200,
    },
    {
      key: 'reclaim_status',
      label: 'Status',
      renderCell: ({ status }) => <span style={{ color: statusColor(status), fontWeight: 550 }}>{valOrEmpty(status)}</span>,
      getCellVal: ({ status }) => status,
      width: 100,
    },
    {
      key: 'set_status_manually',
      label: 'Set status manually',
      renderCell: reclaimCase => (
        <Button
          disabled={reclaimCase.status === 'CLOSED'}
          data-cy="setStatusManually"
          onClick={() => handleSetStatusClick(reclaimCase)}
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
        data={reclaimCases}
        defaultCellWidth={125}
      />
      <ManualStatusUpdateModal />
    </>
  )
}

export default ReclaimTable
