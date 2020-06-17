import React from 'react'
import ReactMarkdown from 'react-markdown'
import useTranslation from 'Utilities/useTranslation'

export default function TranslatedMarkdown({ textKey }) {
  const translation = useTranslation(textKey)
  return <div data-cy={textKey}><ReactMarkdown source={translation} /></div>
}
