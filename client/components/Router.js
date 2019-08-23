import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'

import MainPage from 'Components/MainPage'
import AdminPage from 'Components/AdminPage'
import DistributorPage from 'Components/DistributorPage'
import StaffPage from 'Components/StaffPage'
import StudentPage from 'Components/StudentPage'
import UnauthorizedPage from 'Components/UnauthorizedPage'
import NotFoundPage from 'Components/NotFoundPage'

const Router = () => {
  const user = useSelector(state => state.user.data)
  if (!user) return <div> Loading </div>
  return (
    <div className="content" style={{ padding: '10px' }}>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/admin" component={AdminPage} />
        <Route exact path="/distributor" component={DistributorPage} />
        <Route exact path="/staff" component={StaffPage} />
        <Route exact path="/student" component={StudentPage} />
        <Route exact path="/unauthorized" component={UnauthorizedPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </div>
  )
}


export default Router
