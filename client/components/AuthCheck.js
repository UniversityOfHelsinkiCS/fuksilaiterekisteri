import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useAuth from 'Utilities/useAuth'

const AuthCheck = ({ location, children, history }) => {
  const user = useSelector(state => state.user.data)
  const authorized = useAuth(user, location.pathname.split('/')[1])

  useEffect(() => {
    if (!authorized) {
      history.push('/')
    }
  }, [authorized])

  return children
}

export default withRouter(AuthCheck)
