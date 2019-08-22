const checkAdmin = (req, res, next) => {
  const { user } = req
  if (user && user.admin) {
    return next()
  }
  return res.status(403).json({ error: 'forbidden' })
}

module.exports = {
  checkAdmin,
}
