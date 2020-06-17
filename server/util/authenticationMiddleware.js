const db = require('@models')
const { getStudentStatus, isEligible } = require('@services/student')
const { inProduction } = require('./common')
const logger = require('@util/logger')
const { getServiceStatusObject } = require('@controllers/serviceStatusController')

const createUserStudyprogrammes = async (studyrights, user) => {
  const allStudyprograms = await db.studyProgram.findAll({
    attributes: ['id', 'code'],
  })

  const studyprogramCodeToId = allStudyprograms.reduce((acc, { id, code }) => {
    acc[code] = id
    return acc
  }, {})
  const allStudyprogramCodes = new Set(allStudyprograms.map(({ code }) => code))

  return Promise.all([
    studyrights.data.map(
      ({ elements }) => new Promise(async (resolveStudyright) => {
        await Promise.all([
          elements.map(
            ({ code }) => new Promise(async (resolveElement) => {
              if (
                allStudyprogramCodes.has(code)
                    && !(
                      user.studyPrograms
                      && user.studyPrograms.map(c => c.code).includes(code)
                    )
              ) {
                await db.userStudyProgram.create({
                  userId: user.id,
                  studyProgramId: studyprogramCodeToId[code],
                })
                resolveElement()
              }
            }),
          ),
        ])
        resolveStudyright()
      }),
    ),
  ])
}

const createStaffStudyprogrammes = async (codes, user) => {
  const studyprograms = await db.studyProgram.findAll({
    where: { code: codes },
    attributes: ['id'],
  })

  studyprograms.forEach((p) => {
    db.userStudyProgram.create({
      userId: user.id,
      studyProgramId: p.id,
    })
  })
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

  const foundUser = await db.user.findOne({
    where: { userId: uid },
    include: [
      {
        model: db.studyProgram,
        as: 'studyPrograms',
        through: { attributes: [] },
        attributes: ['name', 'code'],
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

    const newUser = await db.user.create({
      ...defaultParams,
    })

    if (!inProduction && uid === 'non_admin_staff') await createStaffStudyprogrammes(['KH50_005'], newUser)

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
  createUserStudyprogrammes,
}
