import React from 'react'
import { Button } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserAction } from 'Utilities/redux/userReducer'

const headerStyle = {
  position: 'absolute',
  top: '11px',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}

const userStyle = {
  margin: '16px',
  float: 'right',
}

export default () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const handleLogout = () => {
    dispatch(logoutUserAction())
  }

  return (
    <div className="navbar">
      <a href="https://github.com/UniversityOfHelsinkiCS/tietosuojaselosteet/blob/master/kurssikirjanpidon_tietosuojaseloste.pdf">Tietosuojaseloste</a>
      <h1 style={headerStyle}>FUKSILAITTEET</h1>
      {user.data ? (
        <div style={userStyle}>
          <Button content={`Log out ${user.data.name}`} icon="sign-out" labelPosition="right" onClick={handleLogout} />
        </div>
      ) : null}
    </div>
  )
}
