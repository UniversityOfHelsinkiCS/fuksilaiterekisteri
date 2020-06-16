import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Loader } from 'semantic-ui-react'
import { getUserAction } from 'Utilities/redux/userReducer'
import { parseUserRights } from 'Utilities/useAuth'
import { initShibbolethPinger } from 'unfuck-spa-shibboleth-session'
import AuthCheck from 'Components/AuthCheck'
import Sidebar from 'Components/Sidebar'
import NavBar from 'Components/NavBar'
import Footer from 'Components/Footer'
import Router from 'Components/Router'
import Notifications from 'Components/Notifications'
import { inProduction } from 'Utilities/common'
import 'react-datepicker/dist/react-datepicker.css'
import { getServiceStatus } from 'Utilities/redux/serviceStatusReducer'

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const user = useSelector(state => state.user)
  const serviceStatus = useSelector(state => state.serviceStatus)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserAction())
    dispatch(getServiceStatus())
    if (inProduction) initShibbolethPinger(60000) // 1 minute
  }, [])

  const handleSidebarOpen = () => setSidebarVisible(true)
  const handleSidebarHide = () => setSidebarVisible(false)


  if (user.error) {
    const studentNumberMissing = user.errorName === 'studentnumber-missing'

    const message = studentNumberMissing ? 'Your have no studentnumber yet. Please check back in a day or two.'
      : 'Registration is closed for maintenance, check again in few hours.'

    return (
      <Sidebar hide={handleSidebarHide} visible={sidebarVisible}>
        <NavBar handleMenuClick={handleSidebarOpen} />
        <div className="page-content">
          <h3 data-cy={studentNumberMissing ? 'no-student-number-error' : 'user-error'}>{message}</h3>
        </div>
        <Footer />
      </Sidebar>
    )
  }

  if (!user.data || user.pending || !serviceStatus.data) {
    return (
      <Sidebar hide={handleSidebarHide} visible={sidebarVisible}>
        <NavBar handleMenuClick={handleSidebarOpen} />
        <div className="page-content">
          <Loader active inline="centered">
            Loading
          </Loader>
        </div>
        <Footer />
      </Sidebar>
    )
  }

  const userRoles = parseUserRights(user.data)

  return (
    <AuthCheck>
      <Sidebar username={user.data.name} roles={userRoles} hide={handleSidebarHide} visible={sidebarVisible}>
        <Notifications />
        <NavBar handleMenuClick={handleSidebarOpen} />
        <Router />
        <Footer />
      </Sidebar>
    </AuthCheck>
  )
}
export default App
