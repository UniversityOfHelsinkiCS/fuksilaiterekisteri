import React from 'react'
import { images, builtAt } from 'Utilities/common'

export default () => (
  <div className="footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div style={{
      display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'center', marginLeft: '10px',
    }}
    >
      <a style={{ display: 'flex', flexDirection: 'column-reverse' }} target="_blank" rel="noopener noreferrer" href="https://github.com/UniversityOfHelsinkiCS/tietosuojaselosteet/blob/master/kurssikirjanpidon_tietosuojaseloste.pdf">Tietosuojaseloste</a>
      <span style={{ display: 'flex', flexDirection: 'column-reverse' }}>{new Date(builtAt).toLocaleString()}</span>
    </div>
    <img src={images.toska_color} style={{ height: '100%', float: 'right' }} alt="tosca" />
  </div>
)
