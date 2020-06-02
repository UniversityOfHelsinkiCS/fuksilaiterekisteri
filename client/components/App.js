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

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserAction())
    initShibbolethPinger(5000)
  }, [])

  const handleSidebarOpen = () => setSidebarVisible(true)
  const handleSidebarHide = () => setSidebarVisible(false)

  if (user.error) {
    return (
      <Sidebar hide={handleSidebarHide} visible={sidebarVisible}>
        <NavBar handleMenuClick={handleSidebarOpen} />
        <div className="page-content">
          <h3>Registration is closed for maintenance, check again in few hours.</h3>
        </div>
        <Footer />
      </Sidebar>
    )
  }

  if (!user.data || user.pending) {
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
