const { NotFoundError } = require('@util/errors')
const { ServiceStatus } = require('../models')

const getServiceStatus = async (req, res) => {
  const serviceStatus = await ServiceStatus.getObject()
  if (!serviceStatus) throw new NotFoundError()
  return res.send(serviceStatus)
}

const setServiceStatus = async (req, res) => {
  const newSettings = req.body

  const updatedStatusObject = await ServiceStatus.updateObject(newSettings)

  return res.json(updatedStatusObject)
}

module.exports = {
  getServiceStatus,
  setServiceStatus,
}
