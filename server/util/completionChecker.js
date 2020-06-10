const sendEmail = require('@util/sendEmail')
const logger = require('@util/logger')

const completionChecker = async (user, email) => {
  if (user.wantsDevice && user.eligible && user.digiSkillsCompleted && user.courseRegistrationCompleted) {
    if (process.env.EMAIL_ENABLED !== 'true') {
      logger.error('Email disabled, set EMAIL_ENABLED=true to enable.')
      return
    }
    const info = await sendEmail([user.hyEmail, user.personalEmail], email.subject, email.body)
    if (info) {
      info.accepted.forEach(accepted => logger.info(`Email sent to ${accepted}.`))
    }
  }
}

module.exports = completionChecker
