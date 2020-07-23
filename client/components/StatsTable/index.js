import React, { useMemo, useState } from 'react'
import {
  Table, Button, Select, Icon,
} from 'semantic-ui-react'

const StatsTable = ({ students }) => {
  const [hideStatsTable, setHideStatsTable] = useState(false)
  const [selectedYear, setSelectedYear] = useState()

  const getStats = () => {
    const def = {
      wants: 0, needs: 0, received: 0, total: 0,
    }
    const stats = {
      Windows: {
        ...def,
      },
      Cubbli: {
        ...def,
      },
    }
    const totals = {
      totalWants: 0,
      totalNeeds: 0,
      totalReceived: 0,
      total: 0,
    }
    const cubbli = ['KH50_002', 'KH50_005', 'KH50_008']

    const hasRequiredComplete = ({ eligible, digiSkillsCompleted, courseRegistrationCompleted }) => eligible && digiSkillsCompleted && courseRegistrationCompleted

    students.filter(({ signupYear }) => signupYear === selectedYear).forEach((student) => {
      if (!student.studyPrograms || !student.studyPrograms.length) return
      const cubbliProgram = student.studyPrograms.find(({ code }) => cubbli.includes(code))
      const targetOs = cubbliProgram ? 'Cubbli' : 'Windows'
      const targetProgram = (cubbliProgram && cubbliProgram.name) || student.studyPrograms[0].name
      if (!stats[targetProgram]) stats[targetProgram] = { ...def }
      if (student.wantsDevice && !student.deviceSerial && !hasRequiredComplete(student)) {
        stats[targetOs].wants++
        stats[targetProgram].wants++
      } else if (student.wantsDevice && !student.deviceSerial && hasRequiredComplete(student)) {
        stats[targetOs].needs++
        stats[targetProgram].needs++
      } else if (student.deviceSerial) {
        stats[targetOs].received++
        stats[targetProgram].received++
      }
    })
    Object.entries(stats).forEach(([key, stat]) => {
      stats[key].total = Object.values(stat).reduce((acc, curr) => acc + curr, 0)
      stats[key].devicesNeeded = stats[key].wants + stats[key].needs
    })
    totals.totalWants = stats.Windows.wants + stats.Cubbli.wants
    totals.totalNeeds = stats.Windows.needs + stats.Cubbli.needs
    totals.totalReceived = stats.Windows.received + stats.Cubbli.received
    totals.total = stats.Windows.total + stats.Cubbli.total
    totals.devicesNeeded = totals.totalWants + totals.totalNeeds

    return { stats, totals }
  }

  const years = useMemo(() => {
    const temp = students.reduce((pre, { signupYear }) => {
      if (!pre.includes(signupYear)) pre.push(signupYear)
      return pre
    }, []).sort((a, b) => b - a)

    setSelectedYear(temp[0])

    return temp.map(e => ({
      key: e,
      value: e,
      text: e,
    }))
  }, [students.length])


  const getCellsFor = (stats, prop) => Object.keys(stats).map(key => (
    <Table.Cell key={key}>
      {stats[key][prop]}
    </Table.Cell>
  ))

  const ToggleStatsTable = () => (
    <Button style={{ width: '15em' }} onClick={() => setHideStatsTable(!hideStatsTable)}>
      <Icon name={hideStatsTable ? 'eye' : 'eye slash'} />
      {hideStatsTable ? 'Show Statistics' : 'Hide Statistics'}
    </Button>
  )

  const { stats, totals } = useMemo(() => getStats(), [students, selectedYear])
  const { Cubbli, Windows, ...programmeStats } = stats

  if (hideStatsTable) return <ToggleStatsTable />

  return (
    <div style={{ overflow: 'auto', maxWidth: '100%', marginBottom: '10px' }}>
      <ToggleStatsTable />
      <span style={{ padding: '0em 1em' }}>Showing statistics from year:</span>
      <Select
        data-cy="customTextSelect"
        value={selectedYear}
        onChange={(e, { value }) => setSelectedYear(value)}
        placeholder="Select year for statistics"
        options={years}
      />
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
            { Object.keys(programmeStats).map(key => (
              <Table.HeaderCell key={key}>
                {key}
              </Table.HeaderCell>
            )) }
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell collapsing>
              Wants a device
            </Table.Cell>
            <Table.Cell>
              {Windows.wants}
            </Table.Cell>
            <Table.Cell>
              {Cubbli.wants}
            </Table.Cell>
            <Table.Cell active>
              {totals.totalWants}
            </Table.Cell>
            { getCellsFor(programmeStats, 'wants') }
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>
              Ready for a device
            </Table.Cell>
            <Table.Cell>
              {Windows.needs}
            </Table.Cell>
            <Table.Cell>
              {Cubbli.needs}
            </Table.Cell>
            <Table.Cell active>
              {totals.totalNeeds}
            </Table.Cell>
            { getCellsFor(programmeStats, 'needs') }
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>
              Has received a device
            </Table.Cell>
            <Table.Cell>
              {Windows.received}
            </Table.Cell>
            <Table.Cell>
              {Cubbli.received}
            </Table.Cell>
            <Table.Cell active>
              {totals.totalReceived}
            </Table.Cell>
            { getCellsFor(programmeStats, 'received') }
          </Table.Row>
          <Table.Row active>
            <Table.Cell collapsing>
              Total
            </Table.Cell>
            <Table.Cell>
              {Windows.total}
            </Table.Cell>
            <Table.Cell>
              {Cubbli.total}
            </Table.Cell>
            <Table.Cell active>
              {totals.total}
            </Table.Cell>
            { getCellsFor(programmeStats, 'total') }
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>
              Devices still needed
            </Table.Cell>
            <Table.Cell>
              {Windows.devicesNeeded}
            </Table.Cell>
            <Table.Cell>
              {Cubbli.devicesNeeded}
            </Table.Cell>
            <Table.Cell active>
              {totals.devicesNeeded}
            </Table.Cell>
            { getCellsFor(programmeStats, 'devicesNeeded') }
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  )
}

export default StatsTable
