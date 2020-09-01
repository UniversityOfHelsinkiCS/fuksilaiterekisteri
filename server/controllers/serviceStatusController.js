const logger = require('@util/logger')
const { ServiceStatus } = require('../models')

const getServiceStatus = async (req, res) => {
  try {
    const serviceStatus = await ServiceStatus.getObject()
    if (!serviceStatus) return res.sendStatus(404)
    return res.send(serviceStatus)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const setServiceStatus = async (req, res) => {
  try {
    const newSettings = req.body

    const old = await ServiceStatus.getObject()

    // Update any key value pait present in req.body. Excluding sequelize stuff:
    Object.keys(newSettings).filter(key => !['id', 'createdAt', 'updatedAt'].includes(key)).forEach((key) => {
      old[key] = newSettings[key]
    })

    await old.save()

    return res.json(old)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

module.exports = {
  getServiceStatus,
  setServiceStatus,
}
