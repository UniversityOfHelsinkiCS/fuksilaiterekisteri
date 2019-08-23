import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Sidebar, Segment, Menu, Icon,
} from 'semantic-ui-react'

import {
  possibleUsers, getHeaders, setHeaders, clearHeaders,
} from 'Utilities/fakeShibboleth'
import { getUserAction } from 'Utilities/redux/userReducer'
import { inProduction } from 'Utilities/common'

const FakeShibboBar = ({ children, getUser }) => {
  if (inProduction) return children
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [uid, setUid] = useState(getHeaders().uid)

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

  const handleShow = () => setSidebarVisible(true)

  const handleHide = () => setSidebarVisible(false)

  return (
    <Sidebar.Pushable as={Segment}>
      <Sidebar
        as={Menu}
        direction="right"
        animation="overlay"
        onHide={handleHide}
        vertical
        visible={sidebarVisible}
        width="thin"
      >
        {possibleUsers.map(u => (
          <Menu.Item key={u.uid} id={u.uid} onClick={chooseUser} disabled={uid === u.uid}>
            {u.uid}
          </Menu.Item>
        ))}
        <Menu.Item onClick={clearUser} disabled={!uid}>
          <Icon name="home" />
          Clear
        </Menu.Item>
      </Sidebar>
      <Sidebar.Pusher>
        <Icon
          name="gamepad"
          style={{
            position: 'absolute', top: '0', right: '0', cursor: 'pointer', fontSize: 'x-large',
          }}
          onClick={handleShow}
        />

        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>

  )
}

const mapDispatchToProps = dispatch => ({
  getUser: () => dispatch(getUserAction()),
})


export default connect(undefined, mapDispatchToProps)(FakeShibboBar)
