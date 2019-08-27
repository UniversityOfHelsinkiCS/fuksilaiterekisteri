import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Loader } from 'semantic-ui-react'
import { NotificationContainer } from 'react-notifications'
import { getUserAction } from 'Utilities/redux/userReducer'
import AuthCheck from 'Components/AuthCheck'
import FakeShibboBar from 'Components/FakeShibboBar'
import NavBar from 'Components/NavBar'
import Footer from 'Components/Footer'
import Router from 'Components/Router'

const App = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserAction())
  }, [])

  if (user.error) {
    return (
      <FakeShibboBar>
        <NavBar />
        <div className="content">
          <h3>Registration is closed for maintenance, check again in few hours.</h3>
        </div>
        <Footer />
      </FakeShibboBar>
    )
  }

  if (user.pending) {
    return (
      <FakeShibboBar>
        <NavBar />
        <div className="content">
          <Loader active inline="centered">
            Loading
          </Loader>
        </div>
        <Footer />
      </FakeShibboBar>
    )
  }

  return (
    <AuthCheck>
      <FakeShibboBar>
        <NotificationContainer />
        <NavBar />
        <Router />
        <Footer />
      </FakeShibboBar>
    </AuthCheck>
  )
}
export default App
