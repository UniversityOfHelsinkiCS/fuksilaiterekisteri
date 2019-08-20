import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'

export default () => {
  const [greetings, setGreetings] = useState(['Hello'])

  const nextGreeting = `${greetings[greetings.length - 1]}!`
  return (
    <div>
      <h1>Hei, sinä et ole mitään</h1>
      {greetings.join(' ')}
      <br />
      <Button color="purple" onClick={() => setGreetings([...greetings, nextGreeting])}>
        {nextGreeting}
      </Button>
    </div>
  )
}
