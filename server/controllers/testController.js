const db = require('@models')
const logger = require('@util/logger')

const defaultTranslations = require('../../util/defaultTranslations.json')
const { getServiceStatusObject } = require('./serviceStatusController')

const _ = require('lodash')
const fakeShibboleth = require('../../client/util/fakeShibboleth')

const resetTestUsers = async (req, res) => {
  try {
    await db.user.destroy({
      where: {
        userId: fakeShibboleth.possibleUsers.concat(fakeShibboleth.eligilityTestUsers).map(u => u.uid),
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
      registrationDeadline: new Date().setHours(23, 59, 59),
      customTexts: defaultTranslations,
    })

    return res.status(200).end()
  } catch (e) {
    logger.error('error', e)
    return res.status(500).json({ error: 'error' })
  }
}

const createNewUser = async (i, spid) => {
  const b = Math.random() < 0.5
  const c = Math.random() < 0.5

  const hasDevice = Math.random() < 0.5

  const deviceStuff = {
    device_distributed_by: hasDevice ? 'admin' : null,
    deviceSerial: hasDevice ? `RAs${i}` : null,
    deviceGivenAt: hasDevice ? new Date().getTime() : null,
    wantsDevice: hasDevice,
  }

  const defaults = {
    userId: i,
    admin: false,
    studentNumber: b ? Math.floor(Math.random() * 10000000) : null,
    name: `${i}Firstname Lastname`,
    hyEmail: `${i}normal.emailaddress@helsinki.fi`,
    personalEmail: b ? `${i}emailpersonal12345@gmail.com` : null,
    distributor: !b,
    staff: !b,
    reclaimer: !b,
    dateOfBirth: new Date('1.1.2050').getTime(),
    eligible: (b && c) || hasDevice,
    digiSkillsCompleted: hasDevice ? true : Math.random() < 0.5,
    courseRegistrationCompleted: hasDevice ? true : Math.random() < 0.5,
    adminNote: b ? 'hello' : null,
    signupYear: b ? _.sample([2010, 2011, 2019, 2020]) : null,
    eligibilityReasons: {},
    ...deviceStuff,
  }

  db.user.findOrCreate({
    where: { userId: `${i}` },
    defaults,
  }).then(([user, created]) => {
    if (created) {
      logger.info(`Created user ${i}`)
      if (b && c) {
        db.userStudyProgram.create({
          userId: user.id,
          studyProgramId: spid,
        })
      }
    }
  })
}

const createSomeUsers = async (req, res) => {
  try {
    const { id } = await db.studyProgram.findOne({
      where: {
        code: 'KH50_005',
      },
      attributes: ['id', 'code'],
    })

    let i = 0
    while (i++ < 1000) {
      createNewUser(i, id)
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
