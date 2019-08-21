const db = require('@models')
const { getStudentStatus, isEligible } = require('@services/student')

// Plz rename, idk what's happening
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
    studyrights.data.map(({ elements }) => (
      new Promise(async (resolveStudyright) => {
        await Promise.all([
          elements.map(({ code }) => (
            new Promise(async (resolveElement) => {
              if (allStudyprogramCodes.has(code)) {
                await db.userStudyProgram.create({
                  user_id: user.id,
                  study_program_id: studyprogramCodeToId[code],
                })
                resolveElement()
              }
            })
          )),
        ])
        resolveStudyright()
      })
    )),
  ])
}


const authentication = async (req, res, next) => {
  // Headers are in by default lower case, we don't like that.
  db.user.destroy({
    where: {},
    truncate: { cascade: true },
  })

  const {
    employeenumber: employeeNumber = null,
    givenname: givenName = null,
    mail = null,
    schacdateofbirth: schacDateOfBirth = null,
    schacpersonaluniquecode: schacPersonalUniqueCode = null,
    sn = null,
    uid = null,
  } = req.headers

  if (!uid) return res.status(403).json({ error: 'forbidden' })

  const foundUser = await db.user.findOne({ where: { userId: uid } })

  if (foundUser) {
    req.user = foundUser
    return next()
  }

  const studentNumber = schacPersonalUniqueCode ? schacPersonalUniqueCode.split(':')[6] : null

  const defaultParams = {
    userId: uid,
    hyEmail: mail,
    name: `${givenName} ${sn}`,
    dateOfBirth: schacDateOfBirth,
    staff: !!employeeNumber,
    studentNumber,
  }

  // Is a student

  if (!studentNumber) {
    const newUser = await db.user.create({
      ...defaultParams,
    })

    req.user = newUser
    return next()
  }

  console.log('Creating student with number', studentNumber)
  try {
    const { studyrights, eligible } = await isEligible(studentNumber)
    const { digiSkills, hasEnrollments } = await getStudentStatus(studentNumber, studyrights)

    console.log(eligible)
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
    console.log('Creating student failed', e.response.status, e.response.statusText)
    return res.status(500)
  }
}

module.exports = authentication
