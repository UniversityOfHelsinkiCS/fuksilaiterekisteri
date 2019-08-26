import React from 'react'
import { Button } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { logoutUserAction } from 'Utilities/redux/userReducer'

export default () => {
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logoutUserAction())
  }

  return (
    <div className="navbar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>FUKSILAITTEET</h1>
      <Button style={{ position: 'absolute', right: 0, marginRight: '10px' }} icon="sign-out" onClick={handleLogout} />
    </div>
  )
}
