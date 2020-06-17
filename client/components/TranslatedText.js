import React from 'react'
import { Segment } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import useTranslation from 'Utilities/useTranslation'

export default function TranslatedText({ textKey, justMarkdown }) {
  const translation = useTranslation(textKey)

  if (justMarkdown) return <ReactMarkdown source={translation} />

  return (
    <Segment data-cy={textKey} style={{ maxWidth: 1024 }}>
      <ReactMarkdown source={translation} />
    </Segment>
  )
}
