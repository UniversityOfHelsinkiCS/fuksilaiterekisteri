const checkDistributor = (req, res, next) => {
  const { user } = req
  if (user && user.distributor) {
    return next()
  }
  return res.status(403).json({ error: 'forbidden' })
}

module.exports = {
  checkDistributor,
}
