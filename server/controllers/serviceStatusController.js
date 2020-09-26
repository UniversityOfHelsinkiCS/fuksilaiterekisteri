const { NotFoundError } = require('@util/errors')
const { ServiceStatus } = require('../models')

const getServiceStatus = async (req, res) => {
  const serviceStatus = await ServiceStatus.getObject()
  if (!serviceStatus) throw new NotFoundError()
  return res.send(serviceStatus)
}

const setServiceStatus = async (req, res) => {
  const newSettings = req.body

  const old = await ServiceStatus.getObject()

  // Update any key value pair present in req.body. Excluding sequelize stuff:
  Object.keys(newSettings).filter(key => !['id', 'createdAt', 'updatedAt'].includes(key)).forEach((key) => {
    old[key] = newSettings[key]
  })

  await old.save()

  return res.json(old)
}

module.exports = {
  getServiceStatus,
  setServiceStatus,
}
