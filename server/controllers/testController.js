const {
  User, ServiceStatus, StudyProgram, UserStudyProgram, Email,
} = require('@models')
const logger = require('@util/logger')

const defaultTranslations = require('../../util/defaultTranslations.json')

const _ = require('lodash')
const fakeShibboleth = require('../../client/util/fakeShibboleth')

const resetTestUsers = async (req, res) => {
  await User.destroy({
    where: {
      userId: fakeShibboleth.possibleUsers.concat(fakeShibboleth.eligilityTestUsers).map(u => u.uid),
    },
  })
  return res.status(200).end()
}

const disableStudentRegs = async (req, res) => {
  const obj = await ServiceStatus.getObject()
  obj.studentRegistrationOnline = false
  await obj.save()
  return res.status(200).end()
}

const resetServiceStatus = async (req, res) => {
  await ServiceStatus.destroy({
    where: {},
  })

  await ServiceStatus.create({
    studentRegistrationOnline: true,
    currentYear: 2019,
    currentSemester: 139,
    registrationDeadline: '10-1-2070',
    taskDeadline: '10-15-2070',
    customTexts: defaultTranslations,
    deviceSerial: '1s20N3S2NJ00PF1XXXXX',
    serialSeparatorPos: 12,
  })

  return res.status(200).end()
}

const createDeviceGivenAt = () => {
  const a = Math.random() < 0.5

  return a ? new Date().getTime() : new Date(2014).getTime()
}

const createCustomUser = async (userOverrides, studyProgramCode) => {
  const { id } = await StudyProgram.findOne({
    where: {
      code: studyProgramCode,
    },
    attributes: ['id', 'code'],
  })

  const defaults = {
    studentNumber: userOverrides.userId,
    admin: false,
    distributor: false,
    staff: false,
    reclaimer: false,
    hyEmail: `${userOverrides.userId}@helsinki.fi`,
    personalEmail: `${userOverrides.userId}@toskafake12345.fi`,
    dateOfBirth: new Date('1.1.2050').getTime(),
    eligible: true,
    digiSkillsCompleted: true,
    courseRegistrationCompleted: true,
    adminNote: null,
    signupYear: 2018,
    eligibilityReasons: {},
    wantsDevice: true,
    device_distributed_by: null,
    deviceSerial: userOverrides.deviceGivenAt && `${userOverrides.userId}-serial`,
    deviceGivenAt: null,
    deviceReturned: false,
    ...userOverrides,
  }

  await User.destroy({ where: { userId: userOverrides.userId } })

  const newUser = await User.create({ ...defaults })

  await UserStudyProgram.create({
    userId: newUser.id,
    studyProgramId: id,
  })
}

const createNewUser = async (i, spid) => {
  const b = Math.random() < 0.5
  const c = Math.random() < 0.5

  const hasDevice = Math.random() < 0.5

  const deviceStuff = {
    device_distributed_by: hasDevice ? 'admin' : null,
    deviceSerial: hasDevice ? `RAs${i}` : null,
    deviceGivenAt: hasDevice ? createDeviceGivenAt() : null,
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

  User.findOrCreate({
    where: { userId: `${i}` },
    defaults,
  }).then(([user, created]) => {
    if (created) {
      logger.info(`Created user ${i}`)
      if (b) {
        UserStudyProgram.create({
          userId: user.id,
          studyProgramId: spid,
        })
      }
    }
  })
}

const createSomeUsers = async (req, res) => {
  const spIds = (await StudyProgram.findAll({
    attributes: ['id', 'code'],
  })).map(({ id }) => id)


  let i = 0
  while (i++ < 1000) {
    createNewUser(i, _.sample(spIds))
  }


  return res.status(200).end()
}

const createUser = async (req, res) => {
  const { userInfo, studyProgramCode } = req.body
  await createCustomUser(userInfo, studyProgramCode)
  return res.status(200).end()
}

const advance = async (req, res) => {
  const obj = await ServiceStatus.getObject()
  obj.currentYear = 2020
  obj.currentSemester = 201
  await obj.save()
  return res.status(200).end()
}

const setSerial = async (req, res) => {
  const newSerial = req.params.serial
  const obj = await ServiceStatus.getObject()
  obj.deviceSerial = newSerial
  await obj.save()
  return res.status(200).end()
}

const setServiceStatus = async (req, res) => {
  const newSettings = req.body

  const serviceStatus = await ServiceStatus.findAll({
    limit: 1,
    order: [['updatedAt', 'DESC']],
  })

  await serviceStatus[0].update({ ...newSettings })

  return res.status(200).end()
}


const resetEmailTemplates = async (req, res) => {
  const { type } = req.params
  await Email.destroy({ where: { type } })
  return res.status(200).end()
}

module.exports = {
  resetTestUsers,
  resetServiceStatus,
  disableStudentRegs,
  createSomeUsers,
  advance,
  createUser,
  setSerial,
  setServiceStatus,
  resetEmailTemplates,
}
