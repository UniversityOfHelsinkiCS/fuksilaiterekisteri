import React from 'react'
import { Button, Flag } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { setLocale } from 'Utilities/redux/localeReducer'

export const LocaleSelector = (props) => {
  const dispatch = useDispatch()

  return (
    <div {...props}>
      <Flag data-cy="setlocale-fi" onClick={() => dispatch(setLocale('fi'))} name="fi" />
      <Flag data-cy="setlocale-en" onClick={() => dispatch(setLocale('en'))} name="gb" />
    </div>
  )
}

export default ({ handleMenuClick }) => {
  const stopLoginAs = () => {
    window.localStorage.removeItem('adminLoggedInAs')
    window.location.reload()
  }

  const loggedInAs = window.localStorage.getItem('adminLoggedInAs')

  return (
    <div className="navbar" style={{ display: 'flex', alignItems: 'center' }}>
      <LocaleSelector style={{ padding: '1em' }} />
      {loggedInAs && <Button negative onClick={stopLoginAs}>{`Stop login as ${loggedInAs}`}</Button>}
      <h1 style={{ margin: '0 auto' }}>
        FUKSILAITTEET
      </h1>
      <Button style={{ position: 'absolute', right: 0, marginRight: '10px' }} icon="align justify" onClick={handleMenuClick} />

    </div>
  )
}
