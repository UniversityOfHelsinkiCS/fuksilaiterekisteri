import React from 'react'
import TranslatedText from 'Components/TranslatedText'
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
}


export default function NotEligible({ user }) {
  const { eligibilityReasons } = user
  const locale = useSelector(localeSelector)

  const EligibilityBreakdown = () => {
    if (!eligibilityReasons) return null // Only users starting from 2020 have eligibilityReasons (unless updated).

    return (
      <>
        <Header as="h3">
          {translations.header[locale]}
        </Header>
        <List>
          {Object.entries(eligibilityReasons).map(([key, status]) => {
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


  return (
    <Segment style={{ maxWidth: '1024px' }}>
      <TranslatedText textKey="notEligible" justMarkdown />
      <EligibilityBreakdown />
    </Segment>
  )
}
