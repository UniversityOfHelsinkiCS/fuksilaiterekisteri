import React from 'react'
import { Button } from 'semantic-ui-react'

export default ({ handleMenuClick }) => (
  <div className="navbar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <h1 style={{ margin: 0 }}>FUKSILAITTEET</h1>
    <Button style={{ position: 'absolute', right: 0, marginRight: '10px' }} icon="align justify" onClick={handleMenuClick} />
  </div>
)
