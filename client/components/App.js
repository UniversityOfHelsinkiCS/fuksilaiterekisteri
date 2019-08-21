import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserAction } from 'Utilities/redux/userReducer'
import AuthCheck from 'Components/AuthCheck'
import FakeShibboBar from 'Components/FakeShibboBar'
import NavBar from 'Components/NavBar'
import Footer from 'Components/Footer'
import Router from 'Components/Router'

const App = () => {
  const user = useSelector(state => state.user.data)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserAction())
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
export default App
