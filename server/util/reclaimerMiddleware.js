const checkReclaimer = (req, res, next) => {
  const { user } = req
  if (user && user.reclaimer) {
    return next()
  }
  return res.status(403).json({ error: 'forbidden' })
}

module.exports = {
  checkReclaimer,
}
