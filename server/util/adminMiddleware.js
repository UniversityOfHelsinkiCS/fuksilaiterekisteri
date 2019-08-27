const checkAdmin = (req, res, next) => {
  const { user } = req
  if (user && user.admin) {
    return next()
  }
  return res.status(403).json({ error: 'forbidden' })
}

const checkStaffOrAdmin = (req, res, next) => {
  const { user } = req
  if (user && (user.admin || user.staff)) {
    return next()
  }
  return res.status(403).json({ error: 'forbidden' })
}

module.exports = {
  checkAdmin,
  checkStaffOrAdmin,
}
