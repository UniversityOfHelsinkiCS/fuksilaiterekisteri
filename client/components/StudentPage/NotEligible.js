import React from 'react'
import { Segment } from 'semantic-ui-react'

const NotEligible = () => (
  <Segment>
    <div>
      <p>
        <b>Valitettavasti et ole oikeutettu fuksilaitteeseen.</b>
      </p>
      <p>
        Laitteet lainataan vain tänä lukukautena virallisesti ensimmäistä kertaa
        läsnäoleville matemaattis-luonnontieteellisen tiedekunnan
        kandiopiskelijoille, poislukien vaihto-oppilaat. Tähän sääntöön on
        harvinaisia poikkeuksia, sillä esimerkiksi ennen fuksilaitteiden
        lainausmahdollisuutta läsnäolleet (esim. ennen 2008
        tietojenkäsittelytiedettä opiskelleet) ovat nyt oikeutettuja
        laitteeseen. Jos kuulut tällaiseen ryhmään, mutta näet tämän sivun, ota
        yhteyttä opinto-ohjelmasi fuksilaitevastaavaan.
      </p>
      <hr />
      <p>
        <b>Unfortunately you are not eligible for the fresher device.</b>
      </p>
      <p>
        The devices are only available for non-exchange students who are
        currently officially present for the first time for Bachelor level
        studies in the Faculty of Science. There are rare exceptions to this
        rule, such as people who have previously been present for studies, but
        before the lending of devices began (e.g. present before 2008 for
        Computer Science). If you consider yourself eligible, but are seeing
        this page, please contact the person responsible for fresher devices in
        your study programme to request an exception.
      </p>
    </div>
  </Segment>
)
export default NotEligible
