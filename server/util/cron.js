const { CronJob } = require('cron')
const logger = require('@util/logger')
const { updateEligibleStudentStatuses, checkStudentEligibilities } = require('@services/student')

const startCron = () => new CronJob({
  cronTime: '0 * * * *',
  onTick: async () => {
    logger.info('Updating eligible student statuses...')
    try {
      await updateEligibleStudentStatuses()
    } catch (e) {
      logger.error('Failed updating eligible student statuses!', e)
    }

    logger.info('Checking student eligibilities...')
    try {
      await checkStudentEligibilities()
    } catch (e) {
      logger.error('Failed checking student eligibilities!', e)
    }
  },
  start: true,
  timeZone: 'Europe/Helsinki',
})

module.exports = {
  startCron,
}
