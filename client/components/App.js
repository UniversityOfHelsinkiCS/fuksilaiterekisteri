import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getUserAction } from 'Utilities/redux/userReducer'
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
    <FakeShibboBar>
      <NavBar />
      <Router />
      <Footer />
    </FakeShibboBar>
  )
}

const mapStateToProps = ({ user }) => ({
  user,
})

const mapDispatchToProps = {
  getUser: getUserAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
