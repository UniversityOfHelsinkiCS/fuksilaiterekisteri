import React from 'react'
import {
  Message, Button,
} from 'semantic-ui-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, error, errorInfo })
  }

  render() {
    const { hasError, error, errorInfo } = this.state
    const { children } = this.props
    if (!hasError) {
      return children
    }
    return (
      <div style={{ padding: '5em' }}>
        <Message error>
          There was an error while loading this page.
          <br />
          {errorInfo && `Error: ${error.message.toString()}`}
          <br />
          {errorInfo && errorInfo.componentStack}
          <br />
          <br />
          <Button color="blue" onClick={() => window.location.reload()}>Reload the page</Button>
        </Message>
      </div>
    )
  }
}
