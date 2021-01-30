const nodemailer = require('nodemailer')
const { User } = require('@models')
const logger = require('@util/logger')


const sendEmail = async ({
  recipients, subject, text, replyTo, attachments,
}) => {
  if (process.env.EMAIL_ENABLED !== 'true') {
    logger.error('Email disabled, set EMAIL_ENABLED=true to enable.')
    return { accepted: [], rejected: recipients }
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.helsinki.fi',
    port: 587,
    secure: false,
  })

  return transporter.sendMail({
    from: 'Fuksilaite Robot <noreply@helsinki.fi>',
    bcc: recipients,
    subject,
    text,
    attachments,
    replyTo,
  })
}

const sendToAddresses = async ({
  addresses, subject, text, replyTo,
}) => {
  logger.info(`Attempting to send emails to ${addresses.length} email-addresses.`)

  const emailResult = await sendEmail({
    recipients: addresses,
    subject,
    text,
    replyTo,
  })

  logger.info(`Successfully sent ${emailResult.accepted.length} emails to ${JSON.stringify(emailResult.accepted)}`)
  if (emailResult.rejected.length > 0) {
    logger.info(`Failed to send ${emailResult.rejected.length} emails to ${JSON.stringify(emailResult.rejected)}`)
  }

  return emailResult
}

const sendToUsers = async ({
  userIds, subject, text, replyTo,
}) => {
  const usersToBeContacted = await User.findAll({ where: { userId: userIds } })

  const targetEmails = usersToBeContacted.reduce((pre, cur) => {
    const { hyEmail, personalEmail } = cur
    pre.push(hyEmail)
    if (personalEmail) pre.push(personalEmail)
    return pre
  }, [])

  logger.info(`Attempting to send email to ${userIds.length} users, to total of ${targetEmails.length} email-addresses.`)

  const emailResult = await sendEmail({
    recipients: targetEmails,
    subject,
    text,
    replyTo,
  })

  const failedToContact = []
  const successfullyContacted = []

  usersToBeContacted.forEach((user) => {
    const { hyEmail, personalEmail, userId } = user

    if (emailResult.rejected.includes(hyEmail) && emailResult.rejected.includes(personalEmail)) {
      failedToContact.push(userId)
    } else {
      successfullyContacted.push(userId)
    }
  })

  logger.info(`Successfully contacted ${successfullyContacted.length}/${usersToBeContacted.length} users.`)
  if (failedToContact.length > 0) logger.error(`Failed to contact ${failedToContact.length} users: ${JSON.stringify(failedToContact)}`)

  return { emailResult, successfullyContacted, failedToContact }
}

module.exports = { sendEmail, sendToAddresses, sendToUsers }
