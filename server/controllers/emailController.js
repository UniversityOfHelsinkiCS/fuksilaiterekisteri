const nodemailer = require('nodemailer')
const logger = require('@util/logger')
const db = require('@models')

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

const getAutosendTemplate = async (req, res) => {
  try {
    const { type } = req.body

    if (!type) return res.status(400)({ error: 'type attribute missing' })

    const template = await db.email.findOne(({ where: { type } }))

    return res.status(200).json(template)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const updateAutoSendTemplate = async (req, res) => {
  try {
    const { subject, body, type } = req.body

    if (!subject || !body || !type || !type.includes('AUTOSEND')) {
      return res.status(400)({ error: 'invalid parameters' })
    }

    const updatedTemplate = await db.email.update({ subject, body, type }, {
      where: { type },
    })

    return res.status(200).json(updatedTemplate)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

module.exports = { sendEmail, updateAutoSendTemplate, getAutosendTemplate }
