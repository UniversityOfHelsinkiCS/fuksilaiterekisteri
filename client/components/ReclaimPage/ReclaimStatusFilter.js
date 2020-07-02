import React from 'react'
import { Select } from 'semantic-ui-react'

export default function ReclaimStatusFilter({ selected, setSelected }) {
  const selectOptions = [
    { key: 'open', value: 'OPEN', text: 'Open' },
    { key: 'contacted', value: 'CONTACTED', text: 'Contacted' },
    { key: 'closed', value: 'CLOSED', text: 'Closed' },
  ]

  const handleSelect = (e, { value }) => {
    setSelected(value)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', maxWidth: '20em', marginRight: '1em',
    }}
    >
      <span>Select which cases to show</span>
      <Select value={selected} onChange={handleSelect} placeholder="Select" options={selectOptions} />
    </div>
  )
}
