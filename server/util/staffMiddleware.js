const checkStaff = (req, res, next) => {
  const { user } = req
  if (user && user.staff) {
    return next()
  }
  return res.status(403).json({ error: 'forbidden' })
}

module.exports = {
  checkStaff,
}
