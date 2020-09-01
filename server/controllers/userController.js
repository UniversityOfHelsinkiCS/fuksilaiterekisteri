const completionChecker = require('@util/completionChecker')
const logger = require('@util/logger')
const { isSuperAdmin } = require('@util/common')
const {
  User, Email, StudyProgram, UserStudyProgram, ServiceStatus,
} = require('@models')
const { checkAndUpdateEligibility, checkAndUpdateTaskStatuses } = require('@services/student')

const validateEmail = (checkEmail) => {
  const validationRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  // Returns true if valid
  return validationRegex.test(checkEmail) && !checkEmail.includes('helsinki.') && !checkEmail.includes('@cs.')
}

const validateSerial = async (serial, settings) => {
  const FULL_SERIAL_LENGTH = settings.deviceSerial.length
  const STATIC_SERIAL_PART = settings.deviceSerial.substring(0, settings.serialSeparatorPos)
  if (serial.length === FULL_SERIAL_LENGTH && (serial.substr(0, settings.serialSeparatorPos) === STATIC_SERIAL_PART)) return true
  return false
}

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
  const settings = await ServiceStatus.getObject()
  if (!req.user.eligible || req.user.signupYear !== settings.currentYear) {
    return res
      .status(403)
      .json({ error: 'Not eligible.' })
      .end()
  }

  if (req.body.email !== null && !validateEmail(req.body.email)) {
    return res
      .status(400)
      .json({ error: 'Invalid email.' })
      .end()
  }

  try {
    const readyEmail = await Email.findOne({ where: { type: 'AUTOSEND_WHEN_READY' } })
    const updatedUser = await req.user.update({ wantsDevice: true, personalEmail: req.body.email })

    completionChecker(updatedUser, readyEmail)
    return res
      .status(200)
      .json(updatedUser)
      .end()
  } catch (error) {
    logger.error('Error requesting device: ', error)
    return res
      .status(500)
      .json({ error: 'Database error.' })
      .end()
  }
}

const claimDevice = async (req, res) => {
  try {
    const {
      user,
      body: { studentNumber, deviceId },
    } = req

    const settings = await ServiceStatus.getObject()

    if (!studentNumber) return res.status(400).json({ error: 'student number missing' })

    const validSerial = await validateSerial(deviceId, settings)
    if (!validSerial) return res.status(400).json({ error: 'device id missing or invalid' })

    const student = await User.findOne({
      where: {
        studentNumber,
      },
    })

    if (!student) return res.status(404).json({ error: 'student not found' })

    const debug = ['wantsDevice', 'digiSkillsCompleted', 'courseRegistrationCompleted', 'deviceGivenAt', 'signupYear']
      .map(a => !!student[a])

    if (
      !(
        student.eligible
        && student.wantsDevice
        && student.digiSkillsCompleted
        && student.courseRegistrationCompleted
        && !student.deviceGivenAt
        && student.signupYear === settings.currentYear
      )
    ) {
      logger.warn(`User ${user.userId} failed to give a device to ${studentNumber}`)
      return res.status(403).json({ error: 'student not egilible for device', debug })
    }

    const deviceData = {
      device_distributed_by: user.userId,
      deviceSerial: deviceId.substring(settings.serialSeparatorPos),
      deviceGivenAt: new Date(),
    }

    await student.update({
      ...deviceData,
    })

    return res.json(deviceData)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: [{ model: StudyProgram, as: 'studyPrograms' }] })
    res.json(users)
  } catch (e) {
    logger.error(e)
    res.status(500).json({ error: 'error' })
  }
}

const toggleRole = async (req, res) => {
  try {
    const { id, role } = req.params
    const ownId = req.user.id
    const toggleableRoles = ['admin', 'distributor', 'staff', 'reclaimer', 'digiSkillsCompleted', 'courseRegistrationCompleted', 'wantsDevice']

    if (!id) return res.status(400).json({ error: 'user id missing' })
    if (!role || !toggleableRoles.includes(role)) return res.status(400).json({ error: 'role missing or invalid' })

    if ((parseInt(id, 10) === parseInt(ownId, 10)) && role === 'admin') return res.status(403).json({ error: 'Cant remove admin from yourself.' })

    const user = await User.findOne({
      where: {
        id,
      },
      include: [{ model: StudyProgram, as: 'studyPrograms' }],
    })

    if (!user) return res.status(404).json({ error: 'user not found' })

    await user.update({ [role]: !user[role] })
    logger.info(`User ${user.userId} toggled ${role} to ${user[role]} by ${req.user.userId}`)
    return res.json(user)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const setAdminNote = async (req, res) => {
  try {
    const { id } = req.params
    const { note } = req.body

    const user = await User.findOne({
      where: {
        id,
      },
      include: [{ model: StudyProgram, as: 'studyPrograms' }],
    })

    if (!user) return res.status(404).json({ error: 'user not found' })

    await user.update({ adminNote: note })
    logger.info(`User ${user.userId} added admin note by ${req.user.userId}`)
    return res.json(user)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const updateUserStudyPrograms = async (req, res) => {
  try {
    const { id } = req.params
    const { studyPrograms } = req.body

    const userStudyProgramsToDelete = []
    const userStudyProgramsToCreate = []
    Object.entries(studyPrograms).forEach(([studyProgramId, enabled]) => {
      if (enabled) userStudyProgramsToCreate.push(studyProgramId)
      else userStudyProgramsToDelete.push(studyProgramId)
    })

    await UserStudyProgram.destroy({
      where: {
        userId: id,
        studyProgramId: userStudyProgramsToDelete,
      },
    })

    const promises = []
    userStudyProgramsToCreate.forEach((studyProgramId) => {
      promises.push(UserStudyProgram.findOrCreate({
        where: { userId: id, studyProgramId },
        defaults: { userId: id, studyProgramId },
      }))
    })
    await Promise.all(promises)

    const user = await User.findOne({ where: { id }, include: [{ model: StudyProgram, as: 'studyPrograms' }] })

    if (userStudyProgramsToCreate.length === 0) await user.update({ staff: false })

    return res.json(user)
  } catch (e) {
    logger.error(e.message)
    return res.status(500).json({ error: 'error' })
  }
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
