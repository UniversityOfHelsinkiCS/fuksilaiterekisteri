const emailService = require('@services/emailService')
const logger = require('@util/logger')
const { ServiceStatus } = require('@models')

const completionChecker = async (user, email) => {
  if (user.wantsDevice && user.eligible && user.digiSkillsCompleted && user.courseRegistrationCompleted) {
    const settings = await ServiceStatus.getObject()
    const isDistributionOver = new Date().getTime() > new Date(settings.taskDeadline).getTime()

    if (isDistributionOver) return

    if (process.env.EMAIL_ENABLED !== 'true') {
      logger.error('Email disabled, set EMAIL_ENABLED=true to enable.')
      return
    }
    const info = await emailService.sendEmail({
      recipients: [user.hyEmail, user.personalEmail],
      subject: email.subject,
      text: email.body,
      replyTo: email.replyTo,
    })
    if (info) {
      info.accepted.forEach(accepted => logger.info(`Email sent to ${accepted}.`))
    }
  }
}

module.exports = completionChecker
