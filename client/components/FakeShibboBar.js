import React, { useState } from 'react'
import {
  Sidebar, Segment, Menu, Icon,
} from 'semantic-ui-react'
import { possibleUsers, getHeaders, setHeaders } from 'Utilities/fakeShibboleth'

const FakeShibboBar = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [uid, setUid] = useState(getHeaders().uid)

  const chooseUser = ({ target }) => {
    setUid(target.id)
    setHeaders(target.id)
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
          <Menu.Item color="pink" key={u.uid} id={u.uid} onClick={chooseUser} disabled={uid === u.uid}>
            {u.uid}
          </Menu.Item>
        ))}
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

export default FakeShibboBar
