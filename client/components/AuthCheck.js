import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useAuth from 'Utilities/useAuth'

const AuthCheck = ({
  user, location, children, history,
}) => {
  const authorized = useAuth(user, location.pathname.split('/')[1])

  useEffect(() => {
    if (!authorized) {
      history.push('/')
    }
  }, [authorized])

  return <>{children}</>
}

const mapStateToProps = ({ user }) => ({
  user: user.data,
})

export default connect(mapStateToProps)(withRouter(AuthCheck))
