import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

const getRedirectPathForUser = (user) => {
  if (user.admin) return '/admin'
  if (user.distributor) return '/distributor'
  if (user.staff) return '/staff'
  if (user.studentNumber) return '/student'
  return '/unauthorized'
}

const MainPage = ({ user }) => <Redirect to={getRedirectPathForUser(user)} />

const mapStateToProps = ({ user }) => ({
  user: user.data,
})

export default connect(mapStateToProps)(MainPage)
