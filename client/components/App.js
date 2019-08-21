import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUserAction } from 'Utilities/redux/userReducer'
import getRedirectPathForUser from 'Utilities/redirect'
import FakeShibboBar from 'Components/FakeShibboBar'
import NavBar from 'Components/NavBar'
import Footer from 'Components/Footer'
import Router from 'Components/Router'

const App = ({ getUser, user, history }) => {
  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (user.data) {
      history.push(getRedirectPathForUser(user.data))
    }
  }, [user])

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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App))
