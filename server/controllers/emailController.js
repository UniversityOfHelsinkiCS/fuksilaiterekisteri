const nodemailer = require('nodemailer')
const logger = require('@util/logger')
const db = require('@models')

const sendEmail = async (req, res) => {
  try {
    if (process.env.EMAIL_ENABLED !== 'true') {
      logger.error('Email disabled, set EMAIL_ENABLED=true to enable.')
      return res.status(501).json({ error: 'EMAIL_ENABLED = false' })
    }
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
    return res.status(200).json({ message: 'OK' })
  } catch (e) {
    logger.error('Error sending emails', e)
    return res.status(500).json({ error: 'Error trying to send emails' })
  }
}

const getAutosendTemplate = async (req, res) => {
  try {
    const { type } = req.params

    if (!type || !type.includes('AUTOSEND')) return res.status(400).json({ error: 'invalid parameter' })

    const template = await db.email.findOne(({ where: { type } }))

    return res.status(200).json(template)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const updateAutosendTemplate = async (req, res) => {
  try {
    const {
      subject, body, replyTo, type,
    } = req.body

    if (!subject || !body || !type || !type.includes('AUTOSEND')) {
      return res.status(400).json({ error: 'invalid parameters' })
    }

    let template = await db.email.findOne({ where: { type } })

    if (template) await template.update({ subject, body, replyTo })
    else {
      template = await db.email.create({
        subject, body, type, replyTo,
      })
    }

    return res.status(200).json(template)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

module.exports = { sendEmail, updateAutosendTemplate, getAutosendTemplate }
