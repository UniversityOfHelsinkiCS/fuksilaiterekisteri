const { inProduction, isSuperAdmin } = require('../util/common')
const Sentry = require('@sentry/node')
const logger = require('@util/logger')
const { StudyProgram, User, ServiceStatus } = require('@models')

const authentication = async (req, res, next) => {
  // Headers are in by default lower case, we don't like that.
  const {
    givenname: givenName = null,
    mail = null,
    schacdateofbirth: schacDateOfBirth = null,
    hypersonstudentid: hyPersonStudentId = null,
    sn = null,
    uid = null,
  } = req.headers

  if (!uid) return res.status(403).json({ error: 'forbidden' })

  const superAdmin = isSuperAdmin(uid)
  const loggedInAs = req.headers['x-admin-logged-in-as']
  if (loggedInAs) {
    if (superAdmin) {
      const fakeUser = await User.findOne({ where: { userId: loggedInAs }, include: [{ model: StudyProgram, as: 'studyPrograms' }] })
      req.user = fakeUser
      return next()
    }
    logger.warn(`Non superadmin ${uid} tried to use loginAs without permissions`)
    return res.sendStatus(403)
  }
  const foundUser = await User.findOne({
    where: { userId: uid },
    include: [
      {
        model: StudyProgram,
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
    Sentry.setUser(foundUser.get({ plain: true }))
    return next()
  }

  const studentNumber = hyPersonStudentId

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

  if (!studentNumber && !req.headers.employeenumber) {
    return res.status(503).send({ errorName: 'studentnumber-missing' })
  }

  const settings = await ServiceStatus.getObject()

  /* Temporary fix for staff not being able to register. This should be fixed better
  for when the registration opens, because with this fix, staff is only able to register
  when student registrations are closed */
  if (req.headers.employeenumber && !settings.studentRegistrationOnline) {
    const newUser = await User.create({
      ...defaultParams,
    })

    if (!inProduction && uid === 'non_admin_staff') {
      await newUser.createStaffStudyprograms(['KH50_005'])
    }

    req.user = newUser
    Sentry.setUser({ ...defaultParams })
    return next()
  }

  try {
    if (!settings.studentRegistrationOnline) {
      logger.info(`User with studentNumber ${studentNumber} tried to create a new account (registrations are closed)`)
      return res.status(503).send({ error: 'Registrations are closed.' })
    }

    const newUser = await User.create({
      ...defaultParams,
      // eligible,
      // digiSkillsCompleted: digiSkills,
      // courseRegistrationCompleted: hasEnrollments,
      signupYear: settings.currentYear,
      // eligibilityReasons,
    })

    const { eligible, eligibilityReasons } = await newUser.checkEligibility()

    const { digiSkills, hasEnrollments } = await newUser.getStatus()

    await newUser.createUserStudyprograms()

    await newUser.update({
      eligible,
      digiSkillsCompleted: digiSkills,
      courseRegistrationCompleted: hasEnrollments,
      eligibilityReasons,
    })

    req.user = newUser
    Sentry.setUser({ ...newUser })
    if (!eligible) {
      Sentry.withScope((scope) => {
        scope.setUser(req.user ? req.user.get({ plain: true }) : null)
        Sentry.captureMessage('New non eligible user registered!')
      })
    }
    return next()
  } catch (e) {
    logger.error(['Creating student failed', e.toString(), e.response ? e.response.data : null])
    Sentry.withScope(() => {
      Sentry.captureMessage('Creating student failed!')
    })
    return res.status(503).end()
  }
}

module.exports = {
  authentication,
}
