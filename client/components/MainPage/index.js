import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

const getRedirectPathForUser = (user) => {
  if (user.admin) return '/admin'
  if (user.distributor) return '/distributor'
  if (user.staff) return '/staff'
  if (user.reclaimer) return '/reclaimer'
  if (user.studentNumber) return '/student'
  return '/unauthorized'
}

const MainPage = () => {
  const user = useSelector(state => state.user.data)
  return <Redirect to={getRedirectPathForUser(user)} />
}

export default MainPage
