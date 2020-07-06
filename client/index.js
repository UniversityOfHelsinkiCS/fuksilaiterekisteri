import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/browser'
import 'react-virtualized/styles.css'
import 'semantic-ui-css/semantic.min.css'
import 'Assets/custom.css'
import 'react-notifications/lib/notifications.css'

import store from 'Utilities/store'
import { basePath, inProduction, sentryIdentifier } from 'Utilities/common'
import App from 'Components/App'
import ErrorBoundary from 'Components/ErrorBoundary'

if (inProduction && sentryIdentifier) {
  Sentry.init({
    dsn: 'https://9575a52bb5624ee39377d70de0f67f4a@sentry.toska.cs.helsinki.fi/15',
    environment: sentryIdentifier,
  })
}

const refresh = () => render(
  <Provider store={store}>
    <BrowserRouter basename={basePath}>
      <ErrorBoundary>
        <App />
        <button type="submit" style={{ display: 'none' }} onClick={() => Sentry.captureException(new Error('Sentry test'))}>Sentry test</button>
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
)

refresh()

if (module.hot) {
  module.hot.accept()
}
