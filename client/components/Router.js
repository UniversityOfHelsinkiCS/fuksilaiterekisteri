import React from 'react'
import { Route, Switch } from 'react-router-dom'

import MainPage from 'Components/MainPage'
import StudentPage from 'Components/StudentPage'
import NotFoundPage from 'Components/NotFoundPage'

export default () => (
  <div className="content">
    <Switch>
      <Route exact path="/" component={MainPage} />
      <Route exact path="/student" component={StudentPage} />
      <Route path="*" component={NotFoundPage} />
    </Switch>
  </div>
)
