import React, { useMemo } from 'react'
import { Table } from 'semantic-ui-react'

const StatsTable = ({ students }) => {
  const getStats = () => {
    const def = {
      wants: 0, needs: 0, received: 0, total: 0,
    }
    const res = {
      windows: {
        ...def,
      },
      cubbli: {
        ...def,
      },
      totalWants: 0,
      totalNeeds: 0,
      totalReceived: 0,
      total: 0,
    }
    const cubbli = ['KH50_002', 'KH50_005', 'KH50_008']

    const hasRequiredComplete = ({ eligible, digiSkillsCompleted, courseRegistrationCompleted }) => eligible && digiSkillsCompleted && courseRegistrationCompleted

    students.forEach((student) => {
      const target = student.studyPrograms.some(({ code }) => cubbli.includes(code)) ? 'cubbli' : 'windows'
      if (student.wantsDevice && !student.deviceSerial && !hasRequiredComplete(student)) {
        res[target].wants++
      } else if (student.wantsDevice && !student.deviceSerial && hasRequiredComplete(student)) {
        res[target].needs++
      } else if (student.deviceSerial) {
        res[target].received++
      }
    })
    res.windows.total = Object.values(res.windows).reduce((acc, curr) => acc + curr, 0)
    res.cubbli.total = Object.values(res.cubbli).reduce((acc, curr) => acc + curr, 0)
    res.totalWants = res.windows.wants + res.cubbli.wants
    res.totalNeeds = res.windows.needs + res.cubbli.needs
    res.totalReceived = res.windows.received + res.cubbli.received
    res.total = res.windows.total + res.cubbli.total

    return res
  }

  const stats = useMemo(() => getStats(), [students])

  return (
    <Table definition collapsing>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell>
            Windows
          </Table.HeaderCell>
          <Table.HeaderCell>
            Cubbli
          </Table.HeaderCell>
          <Table.HeaderCell>
            Total
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell collapsing>
            Wants a device
          </Table.Cell>
          <Table.Cell>
            {stats.windows.wants}
          </Table.Cell>
          <Table.Cell>
            {stats.cubbli.wants}
          </Table.Cell>
          <Table.Cell>
            {stats.totalWants}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>
            Ready for a device
          </Table.Cell>
          <Table.Cell>
            {stats.windows.needs}
          </Table.Cell>
          <Table.Cell>
            {stats.cubbli.needs}
          </Table.Cell>
          <Table.Cell>
            {stats.totalNeeds}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>
            Has received a device
          </Table.Cell>
          <Table.Cell>
            {stats.windows.received}
          </Table.Cell>
          <Table.Cell>
            {stats.cubbli.received}
          </Table.Cell>
          <Table.Cell>
            {stats.totalReceived}
          </Table.Cell>
        </Table.Row>
        <Table.Row active>
          <Table.Cell collapsing>
            Total
          </Table.Cell>
          <Table.Cell>
            {stats.windows.total}
          </Table.Cell>
          <Table.Cell>
            {stats.cubbli.total}
          </Table.Cell>
          <Table.Cell>
            {stats.total}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>
            Devices still needed
          </Table.Cell>
          <Table.Cell>
            {stats.windows.wants + stats.windows.needs}
          </Table.Cell>
          <Table.Cell>
            {stats.cubbli.wants + stats.cubbli.needs}
          </Table.Cell>
          <Table.Cell>
            {stats.totalWants + stats.totalNeeds}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}

export default StatsTable
