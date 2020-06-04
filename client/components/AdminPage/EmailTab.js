import React from 'react'
import { Tab } from 'semantic-ui-react'
import EmailView from './EmailView'

export default function EmailTab() {
  const panes = [
    {
      menuItem: { key: 'automatedEmailSettings', icon: 'server', content: 'Automated email settings' },
      render: () => <Tab.Pane>TODO</Tab.Pane>,
    },
    {
      menuItem: { key: 'sendMassEmail', icon: 'address book', content: 'Send mass email' },
      render: () => <EmailView />,
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
