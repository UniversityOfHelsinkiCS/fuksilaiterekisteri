import React from 'react'
import { Segment } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import useTranslation from 'Utilities/useTranslation'

export default function TranslatedText({ textKey }) {
  const translation = useTranslation(textKey)

  return (
    <Segment data-cy={textKey} style={{ maxWidth: 1024 }}>
      <ReactMarkdown source={translation} />
    </Segment>
  )
}
