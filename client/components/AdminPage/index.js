import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Tab, Menu, Icon } from 'semantic-ui-react'
import { getServiceStatus } from 'Utilities/redux/serviceStatusReducer'
import AllUsersTab from './AllUsersTab'
import EmailTab from './EmailTab'
import ServiceStatus from './ServiceStatus'


export default () => {
  const serviceStatus = useSelector(state => state.serviceStatus.data)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getServiceStatus())
  }, [])


  const studentRegistrationOnline = (serviceStatus && serviceStatus.studentRegistrationOnline) && !!serviceStatus.studentRegistrationOnline

  const panes = useMemo(() => [
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
          <Icon style={{ marginRight: '5px' }} color={studentRegistrationOnline ? 'green' : 'red'} name="power off" />
          Service status
        </Menu.Item>
      ),

      render: () => <Tab.Pane><ServiceStatus /></Tab.Pane>,
    },
  ], [studentRegistrationOnline])


  return (
    <Tab
      style={{ width: '100%' }}
      panes={panes}
    />
  )
}
