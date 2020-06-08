const db = require('@models')
const logger = require('@util/logger')

const getServiceStatusObject = async () => {
  const serviceStatus = await db.serviceStatus.findAll({
    limit: 1,
    order: [['updatedAt', 'DESC']],
  })

  if (!serviceStatus[0]) return undefined

  return serviceStatus[0]
}


const getServiceStatus = async (req, res) => {
  try {
    const serviceStatus = await getServiceStatusObject()
    if (!serviceStatus) return res.sendStatus(404)
    return res.send(serviceStatus)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

module.exports = {
  getServiceStatus,
  getServiceStatusObject,
}
