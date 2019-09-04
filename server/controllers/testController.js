const db = require('@models')
const logger = require('@util/logger')

const resetTestUsers = async (req, res) => {
  try {
    await db.user.destroy({
      where: {
        userId: ['fuksi', 'non_fuksi_student', 'jakelija', 'admin'],
      },
    })
    return res.status(200).end()
  } catch (e) {
    logger.error('error', e)
    return res.status(500).json({ error: 'error' })
  }
}

module.exports = {
  resetTestUsers,
}
