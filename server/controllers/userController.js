const db = require('@models')
const completionChecker = require('@util/completionChecker')
const logger = require('@util/logger')
const { getServiceStatusObject } = require('./serviceStatusController')
const { inProduction } = require('@util/common')

const validateEmail = (checkEmail) => {
  const validationRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  // Returns true if valid
  return validationRegex.test(checkEmail) && !checkEmail.includes('helsinki.') && !checkEmail.includes('@cs.')
}

const validateSerial = async (serial) => {
  const FULL_SERIAL_LENGTH = 20
  const settings = await getServiceStatusObject()
  if (serial.length === FULL_SERIAL_LENGTH && serial.substr(0, settings.deviceSerial.length) === settings.deviceSerial) return true
  return false
}

const isSuperAdmin = (userId) => {
  if (userId === 'admin' && !inProduction) return true
  if (process.env.SUPERADMINS && process.env.SUPERADMINS.split(',').find(u => u === userId)) return true
  return false
}

const getUser = async (req, res) => {
  const superAdmin = isSuperAdmin(req.user.userId)
  const loggedInAs = req.headers['x-admin-logged-in-as']

  if (loggedInAs) {
    if (superAdmin) {
      const fakeUser = await db.user.findOne({ where: { userId: loggedInAs }, include: [{ model: db.studyProgram, as: 'studyPrograms' }] })
      req.user = fakeUser
    } else {
      logger.warn(`Non superadmin ${req.user.userId} tried to use loginAs without permissions`)
    }
  }
  res.send({
    ...req.user.dataValues,
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
  const settings = await getServiceStatusObject()
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
    const readyEmail = await db.email.findOne({ where: { type: 'AUTOSEND_WHEN_READY' } })
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

    if (!studentNumber) return res.status(400).json({ error: 'student number missing' })

    const validSerial = await validateSerial(deviceId)
    if (!validSerial) return res.status(400).json({ error: 'device id missing or invalid' })

    const student = await db.user.findOne({
      where: {
        studentNumber,
      },
    })

    if (!student) return res.status(404).json({ error: 'student not found' })

    const settings = await getServiceStatusObject()
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
      return res.status(403).json({ error: 'student not egilible for device' })
    }

    const deviceData = {
      device_distributed_by: user.userId,
      deviceSerial: deviceId,
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
    const users = await db.user.findAll({ include: [{ model: db.studyProgram, as: 'studyPrograms' }] })
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
    const toggleableRoles = ['admin', 'distributor', 'staff', 'reclaimer']

    if (!id) return res.status(400).json({ error: 'user id missing' })
    if (!role || !toggleableRoles.includes(role)) return res.status(400).json({ error: 'role missing or invalid' })

    if ((parseInt(id, 10) === parseInt(ownId, 10)) && role === 'admin') return res.status(403).json({ error: 'Cant remove admin from yourself.' })

    const user = await db.user.findOne({
      where: {
        id,
      },
      include: [{ model: db.studyProgram, as: 'studyPrograms' }],
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

    const user = await db.user.findOne({
      where: {
        id,
      },
      include: [{ model: db.studyProgram, as: 'studyPrograms' }],
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

module.exports = {
  getUser,
  getLogoutUrl,
  requestDevice,
  claimDevice,
  getAllUsers,
  setAdminNote,
  toggleRole,
}
