import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUsersAction } from '../../util/redux/usersReducer'
import UserTable from './UserTable'

export default () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users.data)

  useEffect(() => {
    dispatch(getUsersAction())
  }, [])

  return (
    <div>
      <h1>Hei, olet admin</h1>
      <UserTable users={users} />
    </div>
  )
}
