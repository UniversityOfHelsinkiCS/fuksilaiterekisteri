const logger = require('@util/logger')
const { User, Email } = require('@models')
const emailService = require('@services/emailService')

const sendAdminEmail = async (req, res) => {
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

  logger.info(`${req.user.userId} is sending emails`)

  await emailService.sendToAddresses({
    addresses: recipientEmails, subject, text, replyTo,
  })

  return res.status(200).json({ message: 'OK' })
}

const sendReclaimerEmail = async (req, res) => {
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

  logger.info(`${req.user.userId} is sending emails`)

  const { emailResult, successfullyContacted } = await emailService.sendToUsers({
    userIds, subject, text, replyTo,
  })

  await User.markUsersContacted(successfullyContacted)

  return res.status(200).send(emailResult)
}

const getAutosendTemplate = async (req, res) => {
  const { type } = req.params

  if (!type || !type.includes('AUTOSEND')) return res.status(400).json({ error: 'invalid parameter' })

  const template = await Email.findAutosendTemplate(type)

  return res.status(200).json(template)
}

const updateAutosendTemplate = async (req, res) => {
  const {
    subject, body, replyTo, type,
  } = req.body

  if (!subject || !body || !type || !type.includes('AUTOSEND')) {
    return res.status(400).json({ error: 'invalid parameters' })
  }

  const template = await Email.updateOrCreateAutosendTemplate({
    type, subject, body, replyTo,
  })

  return res.status(200).json(template)
}

const getAllAdminTemplates = async (_req, res) => {
  const templates = await Email.findAdminTemplates()
  return res.status(200).json(templates)
}

const createOrUpdateAdminTemplate = async (req, res) => {
  const {
    subject, body, replyTo, description, id,
  } = req.body

  if (!subject || !body || !description) {
    return res.status(400).json({ error: 'invalid parameters' })
  }

  if (!id) {
    const createdTemplate = await Email.create(({
      type: 'ADMIN', subject, body, replyTo, description,
    }))
    return res.status(200).json({ data: createdTemplate, createdId: createdTemplate.id })
  }

  const updatedTemplate = await Email.update({
    subject, body, replyTo, description,
  }, { where: { id } })

  return res.status(200).json({ data: updatedTemplate, createdId: null })
}

const deleteTemplate = async (req, res) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ error: 'id missing' })
  const deleteCount = await Email.deleteTemplate(id)
  if (deleteCount === 0) return res.status(400).json({ error: 'id not found' })
  return res.status(200).send(id)
}

const getAllReclaimerTemplates = async (_req, res) => {
  const templates = await Email.findReclaimerTemplates()
  return res.status(200).json(templates)
}

const createOrUpdateReclaimerTemplate = async (req, res) => {
  const {
    subject, body, replyTo, description, id,
  } = req.body

  if (!subject || !body || !description) {
    return res.status(400).json({ error: 'invalid parameters' })
  }

  if (!id) {
    const createdTemplate = await Email.create(({
      type: 'RECLAIM', subject, body, replyTo, description,
    }))
    return res.status(200).json({ data: createdTemplate, createdId: createdTemplate.id })
  }

  const updatedTemplate = await Email.update({
    subject, body, replyTo, description,
  }, { where: { id } })

  return res.status(200).json({ data: updatedTemplate, createdId: null })
}

const deleteReclaimerTemplate = async (req, res) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ error: 'id missing' })
  const deleteCount = await Email.deleteTemplate(id)
  if (deleteCount === 0) return res.status(400).json({ error: 'id not found' })
  return res.status(200).send(id)
}

module.exports = {
  sendAdminEmail,
  sendReclaimerEmail,
  updateAutosendTemplate,
  getAutosendTemplate,
  getAllAdminTemplates,
  createOrUpdateAdminTemplate,
  deleteTemplate,
  getAllReclaimerTemplates,
  createOrUpdateReclaimerTemplate,
  deleteReclaimerTemplate,
}
