import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Select } from 'semantic-ui-react'

const ReclaimSemesterFilter = ({ selected, setSelected }) => {
  const reclaimCases = useSelector(state => state.reclaimCases.data)

  const semesterSorter = (a, b) => {
    const [aYear, aSemester] = a.split(' ')
    const [bYear, bSemester] = b.split(' ')

    if (aYear < bYear) return 1
    if (aYear > bYear) return -1
    if (aSemester < bSemester) return -1
    return 1
  }

  const semesterOptions = useMemo(() => {
    const caseSemesters = reclaimCases.map(rc => `${rc.year} ${rc.semester}`)
    const uniqueSemesters = Array.from(new Set(caseSemesters)).sort(semesterSorter)
    return [{ key: 'all', value: 'all', text: 'All' }].concat(uniqueSemesters.map(s => ({ key: s, value: s, text: s })))
  }, [reclaimCases])

  const handleSelect = (e, { value }) => {
    setSelected(value)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', maxWidth: '20em', marginRight: '1em',
    }}
    >
      <span>Select case semester</span>
      <Select data-cy="reclaimSemesterFilter" value={selected} onChange={handleSelect} placeholder="Select" options={semesterOptions} />
    </div>
  )
}

export default ReclaimSemesterFilter
