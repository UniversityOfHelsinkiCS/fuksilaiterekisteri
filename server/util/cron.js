const { CronJob } = require('cron')
const logger = require('@util/logger')
const {
  checkStudentEligibilities, runAutumnReclaimStatusUpdater, runSpringReclaimStatusUpdater,
} = require('@services/updaterService')
const { ServiceStatus } = require('@models')

const checkDeadline = async () => {
  const ssObj = await ServiceStatus.getObject()
  const { registrationDeadline, studentRegistrationOnline } = ssObj

  if (!studentRegistrationOnline) return

  if (new Date().getTime() > new Date(registrationDeadline).getTime()) {
    ssObj.studentRegistrationOnline = false
    await ssObj.save()
    logger.info('Deadline has passed. Registrations have been closed automatically.')
  }
}

const startCron = () => {
  logger.info('Starting cron jobs')
  /* eslint-disable no-new */

  // No tasks to update this year
  new CronJob({
    cronTime: '0 * * * *',
    onTick: async () => {
      // logger.info('Updating eligible student statuses...')
      // try {
      //   await updateEligibleStudentStatuses()
      // } catch (e) {
      //   logger.error('Failed updating eligible student statuses!', e)
      // }

      logger.info('Checking deadline...')
      try {
        await checkDeadline()
      } catch (e) {
        logger.error('Failed to check deadline', e)
      }
    },
    start: true,
    timeZone: 'Europe/Helsinki',
  })

  new CronJob({
    cronTime: '15 0 * * *',
    onTick: async () => {
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

  new CronJob({
    cronTime: '30 0 15 8 *', // 15.9. at 00:30 once every year
    onTick: async () => {
      logger.info('Updating reclaim statuses for autumn semester...')
      try {
        await runAutumnReclaimStatusUpdater()
      } catch (e) {
        logger.error('Failed updating reclaim statuses!', e)
      }
      logger.info('Reclaim statuses updated.')
    },
    start: true,
    timeZone: 'Europe/Helsinki',
  })

  new CronJob({
    cronTime: '30 0 31 0 *', // 31.1. at 00:30 once every year
    onTick: async () => {
      logger.info('Updating reclaim statuses for spring semester...')
      try {
        await runSpringReclaimStatusUpdater()
      } catch (e) {
        logger.error('Failed updating reclaim statuses!', e)
      }
      logger.info('Reclaim statuses updated.')
    },
    start: true,
    timeZone: 'Europe/Helsinki',
  })
}

module.exports = {
  startCron,
}
