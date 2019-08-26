import React from 'react'
import { Segment } from 'semantic-ui-react'

const Terms = () => (
  <Segment style={{ maxWidth: '500px' }}>
    Kannettavan tietokoneen tekniset tiedot ovat seuraavat:
    <ul>
      <li>Lenovo ThinkPad T490</li>
      <li>
14
        {'"'}
        {' '}
Full HD -näyttö (resoluutio 1920 x 1080), WLAN, Bluetooth, web-kamera
      </li>
      <li>Intel Core i5-8265U -prosessori, 16 GB:n keskusmuisti, 512 GB:n SSD-levy</li>
      <li>4 vuoden on-site-takuu/guarantee</li>
      <li>Mitat/sizes (L x S x K): 329 mm x 227 mm x 18,9 mm</li>
      <li>Paino/weight: 1,55 kg</li>
    </ul>
    <Segment.Group>
      <Segment>
        Tietokoneeseen on asennettu kandiohjelmasi valinnan mukaisesti joko Cubbli*
        (fysiikka ja
        tietojenkäsittelytiede) tai Microsoft Windows 10 (muut kandiohjelmat).
        Kaikki Helsingin yliopiston opiskelijat voivat asentaa omille laitteilleen Microsoftin Office
        365 -ohjelmistopaketin, johon kuuluu kotikäyttölisenssi viidelle laitteelle. Helsingin yliopisto
        tarjoaa opiskelijoille myös OneDrive-pilvitallennusmahdollisuuden.
        <br />
        <br />
        Fuksilaitteeseen liittyvissa ongelmissa saat parhaiten apua Telegram-kanavilta ja sähköpostilla helpdesk@helsinki.fi.
        <br />
        <br />
        * Common Ubuntu based Linux,
        yliopistolla kehitetty Ubuntuun perustuva Linux
      </Segment>
      <Segment>
        The laptop for Bachelor’s Programme in Science has Microsoft Windows 10 preinstalled.
        All students enrolled at the University of Helsinki may install the Microsoft Office 365
        software package on their own machine, including a home license for five devices. The
        University of Helsinki also offers its students storage space on the OneDrive cloud storage
        service.
        <br />
        <br />
        If you encounter problems with the fresher device, please contact helpdesk@helsinki.fi or ask around in Telegram.
      </Segment>
    </Segment.Group>
  </Segment>
)

export default Terms
