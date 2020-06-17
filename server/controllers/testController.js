const db = require('@models')
const logger = require('@util/logger')

const defaultTranslations = require('../../util/defaultTranslations.json')
const { getServiceStatusObject } = require('./serviceStatusController')

const resetTestUsers = async (req, res) => {
  try {
    await db.user.destroy({
      where: {
        userId: ['fuksi', 'non_fuksi_student', 'jakelija', 'admin'],
      },
    })
    return res.status(200).end()
  } catch (e) {
    logger.error('error', e)
    return res.status(500).json({ error: 'error' })
  }
}

const disableStudentRegs = async (req, res) => {
  try {
    const obj = await getServiceStatusObject()
    obj.studentRegistrationOnline = false
    await obj.save()
    return res.status(200).end()
  } catch (e) {
    logger.error('error', e)
    return res.status(500).json({ error: 'error' })
  }
}

const resetServiceStatus = async (req, res) => {
  try {
    await db.serviceStatus.destroy({
      where: {},
    })

    await db.serviceStatus.create({
      studentRegistrationOnline: true,
      currentYear: 2019,
      currentSemester: 139,
      registrationDeadline: new Date(),
      customTexts: defaultTranslations,
    })

    return res.status(200).end()
  } catch (e) {
    logger.error('error', e)
    return res.status(500).json({ error: 'error' })
  }
}

const createNewUser = async (i) => {
  const b = Math.random() < 0.5
  const c = Math.random() < 0.5

  const defaults = {
    userId: i,
    studentNumber: b ? i : null,
    name: i,
    hyEmail: i,
    personalEmail: b ? i : null,
    distributor: !b,
    staff: !b,
    reclaimer: !b,
    dateOfBirth: new Date('1.1.2050').getTime(),
    device_distributed_by: b ? 'admin' : null,
    deviceSerial: b ? `RAs${i}` : null,
    deviceGivenAt: b ? new Date().getTime() : null,
    eligible: b && c,
    wantsDevice: b && c,
    digiSkillsCompleted: b && c,
    courseRegistrationCompleted: b && c,
    adminNote: b ? 'hello' : null,
    signupYear: b ? 2019 : 2020,
    eligibilityReasons: {},
  }

  db.user.findOrCreate({
    where: { userId: `${i}` },
    defaults,
  }).then(([, created]) => {
    if (created) {
      logger.info(`Created user ${i}`)
    }
  })
}

const createSomeUsers = async (req, res) => {
  try {
    let i = 0
    while (i++ < 1000) {
      createNewUser(i)
    }


    return res.status(200).end()
  } catch (e) {
    logger.error('error', e)
    return res.status(500).json({ error: 'error' })
  }
}

module.exports = {
  resetTestUsers,
  resetServiceStatus,
  disableStudentRegs,
  createSomeUsers,
}
