import React, { useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { getAllReclaimerEmailTemplatesAction } from 'Utilities/redux/emailReducer'
import ReclaimPage from './ReclaimerPage'
import ManageReclaimerTemplates from './ManageReclaimerTemplates'

export default () => {
  const dispatch = useDispatch()

  const TabWrapper = ({ children }) => (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {children}
    </div>
  )

  const panes = [
    {
      menuItem: { key: 'home', icon: 'home', content: 'Reclaimer page' },
      render: () => <TabWrapper><ReclaimPage /></TabWrapper>,
    },
    {
      menuItem: { key: 'manageEmailTemplates', icon: 'settings', content: 'Manage email templates' },
      render: () => <TabWrapper><ManageReclaimerTemplates /></TabWrapper>,
    },
  ]

  useEffect(() => {
    dispatch(getAllReclaimerEmailTemplatesAction())
  }, [])

  return (
    <Tab
      menu={{ pointing: true, secondary: true }}
      style={{ width: '100%' }}
      panes={panes}
    />
  )
}
