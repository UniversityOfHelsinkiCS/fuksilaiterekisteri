const { CronJob } = require('cron')
const logger = require('@util/logger')
const { updateEligibleStudentStatuses } = require('@services/student')

const startCron = () => new CronJob({
  cronTime: '0 * * * *',
  onTick: async () => {
    console.log('Updating eligible student statuses...')
    try {
      await updateEligibleStudentStatuses()
    } catch (e) {
      logger.error('Failed updating eligible student statuses!', e)
    }
  },
  start: true,
  timeZone: 'Europe/Helsinki',
})

module.exports = {
  startCron,
}