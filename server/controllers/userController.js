const getUser = (req, res) => {
  res.send(req.user)
}

const requestDevice = (req, res) => {
  res.sendStatus(200)
}

const claimDevice = (req, res) => {
  res.sendStatus(200)
}

module.exports = {
  getUser,
  requestDevice,
  claimDevice
}
