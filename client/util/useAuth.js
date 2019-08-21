import { useEffect, useState } from 'react'

const pathAccessRights = {
  admin: ['admin'],
  distributor: ['distributor'],
  staff: ['staff'],
  student: ['student'],
}

const parseUserRights = (user) => {
  const res = []
  if (user.admin) res.push('admin')
  if (user.distributor) res.push('distributor')
  if (user.staff) res.push('staff')
  if (user.studentNumber) res.push('student')
  return res
}

const checkAuth = (user, path) => {
  if (!pathAccessRights[path]) return true
  return parseUserRights(user).some(r => pathAccessRights[path].includes(r))
}

export default (user, path) => {
  const [authorized, setAuthorized] = useState(checkAuth(user, path))

  useEffect(() => {
    setAuthorized(checkAuth(user, path))
  }, [user, path])

  return authorized
}
