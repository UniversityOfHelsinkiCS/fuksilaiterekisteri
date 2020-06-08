const db = require('@models')
const logger = require('@util/logger')


const getServiceStatus = async (req, res) => {
  try {
    const serviceStatus = await db.serviceStatus.findAll({
      limit: 1,
      order: [['updatedAt', 'DESC']],
    })

    if (!serviceStatus[0]) return res.sendStatus(404)

    return res.send(serviceStatus[0])
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

module.exports = {
  getServiceStatus,

}
