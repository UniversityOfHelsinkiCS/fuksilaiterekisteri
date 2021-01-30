const { ReclaimCase } = require('@models')
const emailService = require('@services/emailService')
const logger = require('@util/logger')
const { ParameterError } = require('@util/errors')

const getReclaimCases = async (req, res) => {
  const reclaimCases = await ReclaimCase.findAll({})
  return res.status(200).json(reclaimCases)
}

const updateCaseStatus = async (req, res) => {
  const { status } = req.body
  const { reclaimCase } = req

  if (!status) {
    throw new ParameterError('status missing')
  }

  await reclaimCase.updateStatus(status)

  logger.info(`Reclaim case #${reclaimCase.id} status for ${reclaimCase.student.studentNumber} updated by ${req.user.userId}`)

  return res.status(200).json(reclaimCase)
}

const extractStudentEmails = reclaimCases => reclaimCases.reduce((emails, { student }) => {
  emails.push(student.hyEmail)
  if (student.personalEmail) {
    emails.push(student.personalEmail)
  }
  return emails
}, [])

const getSuccessfullyContactedCaseIds = (reclaimCases, emailResults) => reclaimCases
  .filter(({ student }) => {
    const personalEmailSentSuccessfully = !!student.personalEmail && !emailResults.rejected.includes(student.personalEmail)
    const hyEmailSentSuccessfully = !emailResults.rejected.includes(student.hyEmail)

    return personalEmailSentSuccessfully || hyEmailSentSuccessfully
  })
  .map(reclaimCase => reclaimCase.id)

const contactCaseStudents = async (req, res) => {
  if (process.env.EMAIL_ENABLED !== 'true') {
    logger.error('Email disabled, set EMAIL_ENABLED=true to enable.')
    return res.status(501).json({ error: 'EMAIL_ENABLED = false' })
  }

  const {
    reclaimCaseIds,
    subject,
    text,
    replyTo,
  } = req.body

  if (!reclaimCaseIds) {
    throw new ParameterError('reclaimCaseIds missing')
  }
  if (!subject) {
    throw new ParameterError('subject missing')
  }
  if (!text) {
    throw new ParameterError('text missing')
  }

  const reclaimCases = await ReclaimCase.findCases(reclaimCaseIds)
  const studentEmails = extractStudentEmails(reclaimCases)

  logger.info(`${req.user.userId} is sending emails`)
  const emailResults = await emailService.sendToAddresses({
    addresses: studentEmails, subject, text, replyTo,
  })

  const successfullyContactedCaseIds = getSuccessfullyContactedCaseIds(reclaimCases, emailResults)

  await ReclaimCase.updateContactedCases(successfullyContactedCaseIds)

  return res.status(200).send(emailResults)
}

module.exports = { getReclaimCases, updateCaseStatus, contactCaseStudents }
