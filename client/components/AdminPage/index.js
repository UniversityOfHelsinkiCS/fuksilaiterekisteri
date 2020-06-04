import React from 'react'
import { Tab, Menu, Icon } from 'semantic-ui-react'
import AllUsersTab from './AllUsersTab'
import EmailTab from './EmailTab'


export default () => {
  const serviceOnline = true // TODO: use actualy service state

  const panes = [
    {
      menuItem: { key: 'users', icon: 'users', content: 'Users' },
      render: () => <Tab.Pane><AllUsersTab /></Tab.Pane>,
    },
    {
      menuItem: { key: 'email', icon: 'mail', content: 'Email' },
      render: () => <Tab.Pane><EmailTab /></Tab.Pane>,
    },
    {
      menuItem: (
        <Menu.Item key="serviceStatus">
          <Icon style={{ marginRight: '5px' }} color={serviceOnline ? 'green' : 'red'} name="power off" />
          Service status
        </Menu.Item>
      ),

      render: () => <Tab.Pane>TODO</Tab.Pane>,
    },
  ]


  return (
    <Tab
      style={{ width: '100%' }}
      panes={panes}
    />
  )
}
