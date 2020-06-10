const db = require('@models')
const completionChecker = require('@util/completionChecker')
const logger = require('@util/logger')

const validateEmail = (checkEmail) => {
  const validationRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  // Returns true if valid
  return validationRegex.test(checkEmail) && !checkEmail.includes('helsinki.') && !checkEmail.includes('@cs.')
}

const validateSerial = (serial) => {
  const regex = /^PF1[A-Z0-9]{5}$/
  return regex.test(serial)
}

const getUser = (req, res) => {
  res.send(req.user)
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
  if (!req.user.eligible) {
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
    if (!validateSerial(deviceId)) return res.status(400).json({ error: 'device id missing or invalid' })

    const student = await db.user.findOne({
      where: {
        studentNumber,
      },
    })

    if (!student) return res.status(404).json({ error: 'student not found' })

    if (
      !(
        student.eligible
        && student.wantsDevice
        && student.digiSkillsCompleted
        && student.courseRegistrationCompleted
        && !student.deviceGivenAt
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

const toggleStaff = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) return res.status(400).json({ error: 'user id missing' })

    const user = await db.user.findOne({
      where: {
        id,
      },
      include: [{ model: db.studyProgram, as: 'studyPrograms' }],
    })

    if (!user) return res.status(404).json({ error: 'user not found' })

    await user.update({ staff: !user.staff })
    logger.info(`User ${user.userId} toggled staff to ${!user.staff} by ${req.user.userId}`)
    return res.json(user)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const toggleDistributor = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) return res.status(400).json({ error: 'user id missing' })

    const user = await db.user.findOne({
      where: {
        id,
      },
      include: [{ model: db.studyProgram, as: 'studyPrograms' }],
    })

    if (!user) return res.status(404).json({ error: 'user not found' })

    await user.update({ distributor: !user.distributor })
    logger.info(`User ${user.userId} toggled distributor to ${!user.distributor} by ${req.user.userId}`)
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
  toggleStaff,
  toggleDistributor,
  setAdminNote,
}
