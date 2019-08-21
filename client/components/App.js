import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getUserAction } from 'Utilities/redux/userReducer'
import AuthCheck from 'Components/AuthCheck'
import FakeShibboBar from 'Components/FakeShibboBar'
import NavBar from 'Components/NavBar'
import Footer from 'Components/Footer'
import Router from 'Components/Router'

const App = ({ getUser, user }) => {
  useEffect(() => {
    getUser()
  }, [])

  if (!user) {
    return (
      <FakeShibboBar>
        <div> There is no user </div>
      </FakeShibboBar>
    )
  }

  return (
    <AuthCheck>
      <FakeShibboBar>
        <NavBar />
        <Router />
        <Footer />
      </FakeShibboBar>
    </AuthCheck>
  )
}

const mapStateToProps = ({ user }) => ({
  user: user.data,
})

const mapDispatchToProps = {
  getUser: getUserAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
