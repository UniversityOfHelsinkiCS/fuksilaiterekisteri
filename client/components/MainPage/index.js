import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'

import MessageComponent from 'Components/MessageComponent'
import FakeShibboBar from 'Components/FakeShibboBar'

export default () => {
  const [greetings, setGreetings] = useState(['Hello'])

  const nextGreeting = `${greetings[greetings.length - 1]}!`
  return (
    <div>
      {greetings.join(' ')}
      <br />
      <Button color="purple" onClick={() => setGreetings([...greetings, nextGreeting])}>
        {nextGreeting}
      </Button>
      <FakeShibboBar />
      <MessageComponent />
    </div>
  )
}
