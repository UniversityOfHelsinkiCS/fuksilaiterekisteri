/* eslint-disable no-unreachable */
const sendEmail = require('@util/sendEmail')
const logger = require('@util/logger')

const completionChecker = async (user, email) => {
  return // For release safety. Will be removed later.

  if (user.wantsDevice && user.eligible && user.digiSkillsCompleted && user.courseRegistrationCompleted) {
    if (process.env.EMAIL_ENABLED !== 'true') {
      logger.error('Email disabled, set EMAIL_ENABLED=true to enable.')
      // eslint-disable-next-line no-useless-return
      return
    }
    const info = await sendEmail([user.hyEmail, user.personalEmail], email.subject, email.body, email.replyTo)
    if (info) {
      info.accepted.forEach(accepted => logger.info(`Email sent to ${accepted}.`))
    }
  }
}

module.exports = completionChecker
