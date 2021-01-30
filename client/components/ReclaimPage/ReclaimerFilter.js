import React from 'react'
import { Segment, Radio } from 'semantic-ui-react'

export default function ReclaimerFilter({
  filter, setFilter, totalCount, filteredCount,
}) {
  const handleChange = (e, { value }) => {
    setFilter(value)
  }

  const options = [{
    key: 'all',
    name: 'All',
  }, {
    key: 'fresherYearCredits',
    name: 'Credits under limit',
  }, {
    key: 'notPresent',
    name: 'Not enrolled',
  }, {
    key: 'deviceReturnDeadlinePassed',
    name: 'Device loan expired',
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
          data-cy={`${key}-filter`}
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
