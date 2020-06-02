const nodemailer = require('nodemailer')
const logger = require('@util/logger')

const sendEmail = async (req, res) => {
  try {
    const {
      recipientEmails,
      subject,
      text,
      replyTo,
    } = req.body

    const transporter = nodemailer.createTransport({
      host: 'smtp.helsinki.fi',
      port: 587,
      secure: false,
    })

    await transporter.sendMail({
      from: 'Fuksilaite Robot <noreply@helsinki.fi>',
      bcc: recipientEmails,
      subject,
      text,
      replyTo,
    })
    res.status(200).json({ message: 'OK' })
  } catch (e) {
    logger.error('Error sending emails', e)
    res.status(500).json({ error: 'Error trying to send emails' })
  }
}

module.exports = { sendEmail }
