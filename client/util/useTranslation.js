import { useSelector } from 'react-redux'
import { localeSelector } from 'Utilities/redux/localeReducer'
import { customTextSelector } from 'Utilities/redux/serviceStatusReducer'

export default function useTranslation(translationKey) {
  const customTexts = useSelector(customTextSelector)
  const locale = useSelector(localeSelector)
  const translatedText = customTexts[translationKey][locale]

  return translatedText
}
