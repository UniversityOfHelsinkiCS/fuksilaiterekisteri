const logger = require('@util/logger')
const db = require('@models')
const { Op } = require('sequelize')
const sendEmail = require('@util/sendEmail')

const sendAdminEmail = async (req, res) => {
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

    await sendEmail({
      recipients: recipientEmails,
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

const sendReclaimerEmail = async (req, res) => {
  try {
    if (process.env.EMAIL_ENABLED !== 'true') {
      logger.error('Email disabled, set EMAIL_ENABLED=true to enable.')
      return res.status(501).json({ error: 'EMAIL_ENABLED = false' })
    }
    const {
      userIds,
      subject,
      text,
      replyTo,
    } = req.body

    if (!userIds) return res.status(400).json({ error: 'userIds missing' })

    const usersToBeContacted = await db.user.findAll({
      where: {
        userId: {
          [Op.in]: userIds,
        },
      },
    })

    const targetEmails = usersToBeContacted.reduce((pre, cur) => {
      const { hyEmail, personalEmail } = cur
      pre.push(hyEmail)
      if (personalEmail) pre.push(personalEmail)
      return pre
    }, [])

    logger.info(`${req.user.userId} - Attempting to send email to ${userIds.length} users, to total of ${targetEmails.length} email-addresses.`)

    const emailResult = await sendEmail({
      recipients: targetEmails,
      subject,
      text,
      replyTo,
    })

    const promises = []
    const failedToContact = []
    const successfullyContacted = []

    usersToBeContacted.forEach((user) => {
      const { hyEmail, personalEmail, userId } = user

      if (emailResult.rejected.includes(hyEmail) && emailResult.rejected.includes(personalEmail)) {
        failedToContact.push(userId)
      } else {
        promises.push(user.update({ reclaimStatus: 'CONTACTED' }))
        successfullyContacted.push(userId)
      }
    })

    await Promise.all(promises)
    logger.info(`Successfully contacted ${successfullyContacted.length}/${usersToBeContacted.length} users.`)
    if (failedToContact.length > 0) logger.error(`Failed to contact ${failedToContact.length} users.`)

    return res.status(200).send(emailResult)
  } catch (error) {
    logger.error('Error sending emails ', error)
    return res.status(500).json({ error: error.toString() })
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

module.exports = {
  sendAdminEmail, sendReclaimerEmail, updateAutosendTemplate, getAutosendTemplate,
}
