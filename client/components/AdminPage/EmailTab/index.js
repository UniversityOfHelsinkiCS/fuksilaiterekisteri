import React, { useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { getAllAdminEmailTemplatesAction } from 'Utilities/redux/emailReducer'
import MassEmail from './MassEmail'
import AutoEmail from './AutoEmail'
import ManageEmailTemplates from './ManageEmailTemplates'

export default () => {
  const dispatch = useDispatch()
  const panes = [
    {
      menuItem: { key: 'automatedEmailSettings', icon: 'server', content: 'Automated email settings' },
      render: () => <AutoEmail />,
    },
    {
      menuItem: { key: 'sendMassEmail', icon: 'address book', content: 'Send mass email' },
      render: () => <MassEmail />,
    },
    {
      menuItem: { key: 'manageEmailTemplates', icon: 'settings', content: 'Manage email templates' },
      render: () => <ManageEmailTemplates />,
    },

  ]

  useEffect(() => {
    dispatch(getAllAdminEmailTemplatesAction())
  }, [])

  return (
    <Tab
      menu={{ pointing: true, secondary: true }}
      style={{ width: '100%' }}
      panes={panes}
    />
  )
}
