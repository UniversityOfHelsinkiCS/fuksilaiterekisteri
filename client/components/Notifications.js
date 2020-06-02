import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { clearNotification } from '../util/redux/notificationReducer'

const Notifications = () => {
  const { error, success } = useSelector(state => state.notification)

  const dispatch = useDispatch()

  useEffect(() => {
    if (error) NotificationManager.error(error)
    if (success) NotificationManager.success(success)
    dispatch(clearNotification())
  }, [error, success])

  return <NotificationContainer />
}

export default Notifications
