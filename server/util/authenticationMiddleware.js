const db = require('@models')
const { getStudentStatus, isEligible } = require('@services/student')
const { inProduction, isSuperAdmin } = require('./common')
const logger = require('@util/logger')
const { getServiceStatusObject } = require('@controllers/serviceStatusController')

const { createUserStudyprogrammes } = require('@controllers/studentController')


const createStaffStudyprogrammes = async (codes, user) => {
  const studyprograms = await db.studyProgram.findAll({
    where: { code: codes },
    attributes: ['id'],
  })

  const promises = []
  studyprograms.forEach((p) => {
    promises.push(db.userStudyProgram.create({
      userId: user.id,
      studyProgramId: p.id,
    }))
  })
  await Promise.all(promises)

  const userWithStudyPrograms = await db.user.findOne({
    where: { userId: user.userId },
    include: [
      {
        model: db.studyProgram,
        as: 'studyPrograms',
        through: { attributes: [] },
        attributes: ['name', 'code', 'contactEmail', 'contactName'],
      },
    ],
  })

  return userWithStudyPrograms
}

const authentication = async (req, res, next) => {
  // Headers are in by default lower case, we don't like that.
  const {
    givenname: givenName = null,
    mail = null,
    schacdateofbirth: schacDateOfBirth = null,
    schacpersonaluniquecode: schacPersonalUniqueCode = null,
    sn = null,
    uid = null,
  } = req.headers

  if (!uid) return res.status(403).json({ error: 'forbidden' })

  const superAdmin = isSuperAdmin(uid)
  const loggedInAs = req.headers['x-admin-logged-in-as']
  if (loggedInAs) {
    if (superAdmin) {
      const fakeUser = await db.user.findOne({ where: { userId: loggedInAs }, include: [{ model: db.studyProgram, as: 'studyPrograms' }] })
      req.user = fakeUser
      return next()
    }
    logger.warn(`Non superadmin ${uid} tried to use loginAs without permissions`)
    return res.sendStatus(403)
  }

  const foundUser = await db.user.findOne({
    where: { userId: uid },
    include: [
      {
        model: db.studyProgram,
        as: 'studyPrograms',
        through: { attributes: [] },
        attributes: ['name', 'code', 'contactEmail', 'contactName'],
      },
    ],
  })

  if (foundUser) {
    const formattedName = Buffer.from(`${givenName} ${sn}`, 'binary').toString(
      'utf8',
    )
    if (mail !== foundUser.hyEmail) await foundUser.update({ hyEmail: mail })
    if (formattedName !== foundUser.name) await foundUser.update({ name: formattedName })

    req.user = foundUser
    return next()
  }

  const studentNumber = schacPersonalUniqueCode
    ? schacPersonalUniqueCode.split(':')[6]
    : null

  const defaultParams = {
    userId: uid,
    hyEmail: mail,
    name: Buffer.from(`${givenName} ${sn}`, 'binary').toString('utf8'),
    dateOfBirth: schacDateOfBirth,
    staff: false || !!(uid === 'non_admin_staff' && !inProduction),
    distributor: false || !!(uid === 'jakelija' && !inProduction),
    reclaimer: false || !!(uid === 'reclaimer' && !inProduction),
    studentNumber,
    admin: false || !!(uid === 'admin' && !inProduction),
  }

  if (!studentNumber) {
    if (!req.headers.employeenumber) {
      return res.status(503).send({ errorName: 'studentnumber-missing' })
    }

    let newUser = await db.user.create({
      ...defaultParams,
    })

    if (!inProduction && uid === 'non_admin_staff') {
      const updatedUser = await createStaffStudyprogrammes(['KH50_005'], newUser)
      newUser = updatedUser
    }

    req.user = newUser

    return next()
  }

  try {
    const settings = await getServiceStatusObject()
    if (!settings.studentRegistrationOnline) {
      logger.warn(`User with studentNumber ${studentNumber} tried to create a new account (registrations are closed)`)
      return res.status(503).send({ error: 'Registrations are closed.' })
    }

    const { studyrights, eligible, eligibilityReasons } = await isEligible(studentNumber)
    const { digiSkills, hasEnrollments } = await getStudentStatus(
      studentNumber,
      studyrights,
    )

    const newUser = await db.user.create({
      ...defaultParams,
      eligible,
      digiSkillsCompleted: digiSkills,
      courseRegistrationCompleted: hasEnrollments,
      signupYear: settings.currentYear,
      eligibilityReasons,
    })

    await createUserStudyprogrammes(studyrights, newUser)

    req.user = newUser
    return next()
  } catch (e) {
    logger.error('Creating student failed', e.response || ', status missing')
    return res.status(503).end()
  }
}

module.exports = {
  authentication,
}
