import React from 'react'
import { Segment, Radio } from 'semantic-ui-react'

export default function AdminFilter({
  filter, setFilter, totalCount, filteredCount,
}) {
  const handleChange = (e, { value }) => {
    setFilter(value)
  }

  const options = [{
    key: 'all',
    name: 'All',
  }, {
    key: 'deviceHolders',
    name: 'Device holders',
  }, {
    key: 'currentYearEligible',
    name: 'Current years eligible students',
  }, {
    key: 'allStaff',
    name: 'All staff (Admin/staff/distributor/reclaimer)',
  }]

  const style = {
    padding: '0em 1em',
  }


  return (
    <Segment>
      <span>{`Showing ${filteredCount}/${totalCount}`}</span>

      {options.map(({ key, name }) => (
        <Radio
          key={key}
          style={style}
          label={name}
          name="radioGroup"
          value={key}
          checked={filter === key}
          onChange={handleChange}
        />
      ))}
    </Segment>
  )
}
