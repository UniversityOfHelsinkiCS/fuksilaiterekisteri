import React from 'react'
import TranslatedMarkdown from 'Components/TranslatedMarkdown'
import {
  Segment, List, Icon, Header,
} from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { localeSelector } from 'Utilities/redux/localeReducer'


const translations = {
  isPresent: {
    en: 'You have registered to be present',
    fi: 'Olet ilmoittaunut läsnäolevaksi',
  },
  hasValidStudyright: {
    en: 'You have a studyright which makes you eligible for a device',
    fi: 'Sinulla on laitteeseen oikeuttava opiskeluoikeus',
  },
  didRegisterBeforeEndingTime: {
    en: 'You registered for a device before the deadline closed',
    fi: 'Rekisteröityit ajoissa ennen määräajan umpeutumista',
  },
  signedUpForFreshmanDeviceThisYear: {
    en: 'This is your first year requesting the device',
    fi: 'Tämä on ensimmäinen vuosi kun pyydät laitetta',
  },
  header: {
    en: 'Why am I not eligible for a device',
    fi: 'Miksi en ole oikeutettu laitteeseen',
  },
  contactDetails: {
    en: 'If you think that there\'s been a mistake, contact your studyprogramme\'s contact person:',
    fi: 'Jos päätös on mielestäsi virheellinen, ota yhteys koulutusohjelmasi yhteyshenkilöön:',
  },
  notSet: {
    en: 'Not set',
    fi: 'Ei määritelty',
  },
  name: {
    en: 'Name',
    fi: 'Nimi',
  },
}

const fake = {
  user: {
    eligibilityReasons: {
      isPresent: true,
      hasValidStudyright: false,
      didRegisterBeforeEndingTime: false,
      signedUpForFreshmanDeviceThisYear: true,
    },
  },
}

export default function NotEligible({ user, notCurrentYearsFuksi, faking }) {
  const { eligibilityReasons } = faking ? fake.user : user
  const locale = useSelector(localeSelector)
  const studyProgrammes = useSelector(state => state.studyProgrammes.data)

  const EligibilityBreakdown = () => {
    if (!Object.entries(eligibilityReasons).length) return null // Only users starting from 2020 have eligibilityReasons (unless updated).

    return (
      <>
        <Header as="h3">
          {translations.header[locale]}
        </Header>
        <List>
          {Object.entries(eligibilityReasons).map(([key, status]) => {
            if (key === 'signedUpForFreshmanDeviceThisYear' && notCurrentYearsFuksi) {
              // eslint-disable-next-line no-param-reassign
              status = false
            }
            const statusColor = status ? 'green' : 'red'
            const iconName = status ? 'check' : 'x'

            return (
              <List.Item key={key}>
                <Icon name={iconName} color={statusColor} />
                {translations[key][locale]}
              </List.Item>
            )
          })}
        </List>
      </>
    )
  }

  const valOrLocalizedError = param => (param || translations.notSet[locale])

  return (
    <Segment style={{ maxWidth: '1024px' }}>
      <TranslatedMarkdown textKey="notEligible" />
      <EligibilityBreakdown />

      <Header as="h3">{translations.contactDetails[locale]}</Header>
      {studyProgrammes.map(({
        code, name, contactEmail, contactName,
      }) => (
        <div key={code} style={{ display: 'flex', flexDirection: 'column', padding: '0.5em 0em' }}>
          <span style={{ fontWeight: 'bold' }}>{name}</span>
          <span>{`${translations.name[locale]}: ${valOrLocalizedError(contactName)}`}</span>
          <span>{`Email: ${valOrLocalizedError(contactEmail)}`}</span>
        </div>
      ))}

    </Segment>
  )
}
