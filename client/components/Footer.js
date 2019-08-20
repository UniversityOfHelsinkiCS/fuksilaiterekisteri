import React from 'react'
import { images, builtAt } from 'Utilities/common'

export default () => (
  <div className="footer">
    <img src={images.toska_color} style={{ height: '100%', float: 'right' }} alt="tosca" />
    <div style={{ display: 'flex', height: '100%' }}>
      <span style={{ display: 'flex', flexDirection: 'column-reverse' }}>{new Date(builtAt).toLocaleString()}</span>
    </div>
  </div>
)
