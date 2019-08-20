const getUser = (req, res) => {
  res.send({})
}

const requestDevice = (req, res) => {
  res.sendStatus(200)
}

module.exports = {
  getUser,
  requestDevice,
}
