import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { possibleUsers, getHeaders, setHeaders } from 'Utilities/fakeShibboleth'

const MessageComponent = () => {
  const [uid, setUid] = useState(getHeaders().uid)

  const chooseUser = ({ target }) => {
    setUid(target.id)
    setHeaders(target.id)
  }

  return (
    <div style={{ paddingTop: '1em' }}>
      {possibleUsers.map(u => (
        <Button color="pink" key={u.uid} id={u.uid} onClick={chooseUser} disabled={uid === u.uid}>
          Select user
          {u.uid}
        </Button>
      ))}

    </div>
  )
}

export default connect()(MessageComponent)
