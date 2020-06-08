import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getServiceStatus } from 'Utilities/redux/serviceStatusReducer'

export default function ServiceStatus() {
  const dispatch = useDispatch()
  const serviceStatus = useSelector(state => state.serviceStatus.data)

  useEffect(() => {
    dispatch(getServiceStatus())
  }, [])

  useEffect(() => {
  }, [serviceStatus])

  if (!serviceStatus) return 'Loading serviceStatus'


  return (
    <div>
      {Object.entries(serviceStatus).map(entry => (
        <p key={entry[0]}>
          {`${entry[0]} = ${entry[1]}`}
        </p>
      ))}
    </div>
  )
}
