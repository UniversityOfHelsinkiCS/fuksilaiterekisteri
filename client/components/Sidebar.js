import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import {
  Sidebar, Segment, Menu, Icon,
} from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { getUserAction, logoutUserAction } from 'Utilities/redux/userReducer'
import {
  possibleUsers, getHeaders, setHeaders, clearHeaders,
} from 'Utilities/fakeShibboleth'
import { inProduction } from 'Utilities/common'

const pageTranslations = {
  admin: 'Adminin sivu',
  distributor: 'Jakelijan sivu',
  staff: 'Työntekijän sivu',
  student: 'Opiskelijan sivu',
  reclaimer: 'Takaisinperijän sivu',
}

const FakeShibboBar = ({
  children, getUser, visible, hide, roles, history, username,
}) => {
  const [uid, setUid] = useState(getHeaders().uid)
  const dispatch = useDispatch()
  const handleLogout = () => dispatch(logoutUserAction())

  const chooseUser = ({ target }) => {
    setUid(target.id)
    setHeaders(target.id)
    getUser()
  }

  const clearUser = () => {
    setUid(undefined)
    clearHeaders()
    getUser()
  }

  const onLinkClick = link => history.push(`/${link}`)

  const renderDevMenu = () => {
    if (inProduction) return null

    return (
      <>
        <Menu.Item header>Dev stuff</Menu.Item>
        {possibleUsers.map(u => (
          <Menu.Item key={u.uid} id={u.uid} onClick={chooseUser} disabled={uid === u.uid}>
            {u.uid}
          </Menu.Item>
        ))}
        <Menu.Item onClick={clearUser} disabled={!uid}>
          <Icon name="home" />
          Clear
        </Menu.Item>
      </>
    )
  }

  return (
    <Sidebar.Pushable style={{ marginBottom: 0 }} as={Segment}>
      <Sidebar
        as={Menu}
        direction="right"
        animation="overlay"
        onHide={hide}
        vertical
        visible={visible}
        width="thin"
      >
        <Menu.Item header>{username}</Menu.Item>
        {renderDevMenu()}
        { roles && roles.map(r => (
          <Menu.Item link onClick={() => onLinkClick(r)} key={r}>
            {pageTranslations[r]}
          </Menu.Item>
        )) }
        <Menu.Item onClick={handleLogout}>
          <Icon name="sign-out" />
          Kirjaudu ulos
        </Menu.Item>
      </Sidebar>
      <Sidebar.Pusher>
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}

const mapDispatchToProps = dispatch => ({
  getUser: () => dispatch(getUserAction()),
})


export default connect(undefined, mapDispatchToProps)(withRouter(FakeShibboBar))
