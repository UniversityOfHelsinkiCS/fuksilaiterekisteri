const { CronJob } = require('cron')
const logger = require('@util/logger')
const { updateEligibleStudentStatuses, checkStudentEligibilities } = require('@services/student')
const { getServiceStatusObject } = require('@controllers/serviceStatusController')

const checkDeadline = async () => {
  const ssObj = await getServiceStatusObject()
  const { registrationDeadline, studentRegistrationOnline } = ssObj

  if (!studentRegistrationOnline) return

  if (new Date().getTime() > new Date(registrationDeadline).getTime()) {
    ssObj.studentRegistrationOnline = false
    await ssObj.save()
    logger.info('Deadline has passed. Registrations have been closed automatically.')
  }
}

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

module.exports = {
  startCron,
}
