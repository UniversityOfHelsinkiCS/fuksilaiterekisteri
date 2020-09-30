const logger = require('@util/logger')
const { isSuperAdmin, validateEmail } = require('@util/common')
const {
  User, StudyProgram, ServiceStatus, Email,
} = require('@models')
const { ParameterError, NotFoundError, ForbiddenError } = require('@util/errors')
const { checkAndUpdateEligibility, checkAndUpdateTaskStatuses } = require('@services/student')
const completionChecker = require('@util/completionChecker')

const getUser = async (req, res) => {
  let { user } = req

  const superAdmin = isSuperAdmin(user.userId)

  const settings = await ServiceStatus.getObject()
  if (user.studentNumber && !user.deviceGivenAt && (!user.eligible || user.signupYear !== settings.currentYear)) {
    user = await checkAndUpdateEligibility(user)
  }

  if (user.eligible && user.signupYear === settings.currentYear && (!user.digiSkillsCompleted || !user.courseRegistrationCompleted)) {
    user = await checkAndUpdateTaskStatuses(user)
  }

  res.send({
    ...user.dataValues,
    superAdmin,
  })
}

const getLogoutUrl = async (req, res) => {
  try {
    const logoutUrl = req.headers.shib_logout_url || req.headers.logout_url
    const { returnUrl } = req.body
    if (logoutUrl) {
      return res
        .status(200)
        .send({ logoutUrl: `${logoutUrl}?return=${returnUrl || ''}` })
        .end()
    }
    return res
      .status(200)
      .send({ logoutUrl: returnUrl || '' })
      .end()
  } catch (err) {
    return res.status(500).json({ message: 'Error with logout', err })
  }
}

const requestDevice = async (req, res) => {
  const { email } = req.body
  const { user } = req
  const settings = await ServiceStatus.getObject()

  if (!user.eligible || user.signupYear !== settings.currentYear) throw new ForbiddenError('Not eligible')
  if (email !== null && !validateEmail(email)) throw new ParameterError('Invalid email')

  const updatedUser = await user.requestDevice(email)
  const readyEmail = await Email.findAutosendTemplate('AUTOSEND_WHEN_READY')
  await completionChecker(updatedUser, readyEmail)
  return res.json(updatedUser)
}

const claimDevice = async (req, res) => {
  const {
    user,
    body: { studentNumber, deviceId },
  } = req

  if (!studentNumber) throw new ParameterError('studentNumber missing')
  if (!deviceId) throw new ParameterError('deviceId missing')

  const student = await User.findOne({
    where: {
      studentNumber,
    },
  })

  if (!student) throw new NotFoundError('Student not found')

  const deviceData = await student.claimDevice(deviceId, user.userId)
  return res.json(deviceData)
}

const getAllUsers = async (_req, res) => {
  const users = await User.findAll({ include: [{ model: StudyProgram, as: 'studyPrograms' }] })
  res.json(users)
}

const toggleRole = async (req, res) => {
  const { id, role } = req.params
  const ownId = req.user.id
  const toggleableRoles = ['admin', 'distributor', 'staff', 'reclaimer', 'digiSkillsCompleted', 'courseRegistrationCompleted', 'wantsDevice']

  if (!id) throw new ParameterError('user id missing')
  if (!role || !toggleableRoles.includes(role)) throw new ParameterError('role missing or invalid')
  if ((parseInt(id, 10) === parseInt(ownId, 10)) && role === 'admin') throw new ForbiddenError('Cant remove admin from yourself.')

  const user = await User.findOne({
    where: {
      id,
    },
    include: [{ model: StudyProgram, as: 'studyPrograms' }],
  })

  if (!user) throw new NotFoundError('user not found')

  await user.toggleRole(role)
  logger.info(`User ${user.userId} toggled ${role} to ${user[role]} by ${req.user.userId}`)
  return res.json(user)
}

const setAdminNote = async (req, res) => {
  const { id } = req.params
  const { note } = req.body

  const user = await User.findOne({
    where: {
      id,
    },
    include: [{ model: StudyProgram, as: 'studyPrograms' }],
  })

  if (!user) throw new NotFoundError('user not found')

  await user.setAdminNote(note)
  logger.info(`User ${user.userId} added admin note by ${req.user.userId}`)
  return res.json(user)
}

const updateUserStudyPrograms = async (req, res) => {
  const { id } = req.params
  const { studyPrograms } = req.body

  const user = await User.findOne({ where: { id }, include: [{ model: StudyProgram, as: 'studyPrograms' }] })
  if (!user) throw new NotFoundError('User not found')

  await user.updateUserStudyPrograms(studyPrograms)
  return res.json(user)
}

module.exports = {
  getUser,
  getLogoutUrl,
  requestDevice,
  claimDevice,
  getAllUsers,
  setAdminNote,
  toggleRole,
  updateUserStudyPrograms,
}
