import React from 'react'
import { Tab } from 'semantic-ui-react'
import MassEmail from './MassEmail'
import AutoEmail from './AutoEmail'

export default () => {
  const panes = [
    {
      menuItem: { key: 'automatedEmailSettings', icon: 'server', content: 'Automated email settings' },
      render: () => <AutoEmail />,
    },
    {
      menuItem: { key: 'sendMassEmail', icon: 'address book', content: 'Send mass email' },
      render: () => <MassEmail />,
    },

  ]

  return (
    <Tab
      menu={{ pointing: true, secondary: true }}
      style={{ width: '100%' }}
      panes={panes}
    />
  )
}
