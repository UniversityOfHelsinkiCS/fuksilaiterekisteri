const db = require('@models')
const { getStudentStatus, isEligible } = require('@services/student')
const { inProduction } = require('./common')

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
              if (allStudyprogramCodes.has(code) && !(user.studyPrograms && user.studyPrograms.map(c => c.code).includes(code))) {
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

const authentication = async (req, res, next) => {
  // Headers are in by default lower case, we don't like that.
  /* db.user.destroy({
    where: {},
    truncate: { cascade: true },
  }) */

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
    req.user = foundUser
    return next()
  }

  const studentNumber = schacPersonalUniqueCode ? schacPersonalUniqueCode.split(':')[6] : null

  const defaultParams = {
    userId: uid,
    hyEmail: mail,
    name: Buffer.from(`${givenName} ${sn}`, 'binary').toString('utf8'),
    dateOfBirth: schacDateOfBirth,
    staff: false,
    distributor: false || (!!(uid === 'jakelija' && !inProduction)),
    studentNumber,
    admin: false || !!(uid === 'admin' && !inProduction),
  }

  if (!studentNumber) {
    const newUser = await db.user.create({
      ...defaultParams,
    })

    req.user = newUser
    return next()
  }

  try {
    const { studyrights, eligible } = await isEligible(studentNumber)
    const { digiSkills, hasEnrollments } = await getStudentStatus(studentNumber, studyrights)

    const newUser = await db.user.create({
      ...defaultParams,
      eligible,
      digiSkillsCompleted: digiSkills,
      courseRegistrationCompleted: hasEnrollments,
    })

    await createUserStudyprogrammes(studyrights, newUser)

    req.user = newUser
    return next()
  } catch (e) {
    console.log('Creating student failed', e.response || ', status missing')
    return res.status(503).end()
  }
}

module.exports = {
  authentication,
  createUserStudyprogrammes,
}
