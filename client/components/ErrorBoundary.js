import React from 'react'
import { inProduction } from 'Utilities/common'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.setState({ hasError: true })
  }

  render() {
    const { hasError } = this.state
    const { children } = this.props
    if (!hasError || !inProduction) {
      return children
    }
    window.location.reload()
    return null
  }
}
