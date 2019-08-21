const db = require('../../models')
const { getStudentStatus, isEligible } = require('../services/student')

const authentication = async (req, res, next) => {
  // Headers are in by default lower case, we don't like that.
  const {
    employeenumber: employeeNumber = null,
    givenname: givenName = null,
    mail = null,
    schacdateofbirth: schacDateOfBirth = null,
    schacdersonaluniquecode: schacPersonalUniqueCode = null,
    sn = null,
    uid = null,
  } = req.headers

  if (uid) {
    const studentNumber = schacPersonalUniqueCode ? schacPersonalUniqueCode.split(':')[6] : null
    try {
      const foundUser = await db.user.findOne({
        where: {
          userId: uid,
        },
      })

      if (foundUser) {
        req.user = foundUser
        return next()
      }

      const defaultParams = {
        userId: uid,
        hyEmail: mail,
        name: `${givenName} ${sn}`,
        dateOfBirth: schacDateOfBirth,
        employeeNumber,
      }

      if (studentNumber) {
        const {
          studyrights,
          eligible,
        } = await isEligible(studentNumber)
        const {
          digiSkills,
          hasEnrollments,
        } = await getStudentStatus(studentNumber, studyrights)

        const newUser = await db.user.create({
          ...defaultParams,
          eligible,
          digiSkillsCompleted: digiSkills,
          courseRegistrationCompleted: hasEnrollments,
        })

        const allStudyprograms = await db.studyProgram.findAll({
          attributes: ['id', 'code'],
        })

        const studyprogramCodeToId = allStudyprograms.reduce((acc, { id, code }) => {
          acc[code] = id
          return acc
        }, {})
        const allStudyprogramCodes = new Set(allStudyprograms.map(({ code }) => code))

        await Promise.all([
          studyrights.data.map(({ elements }) => (
            new Promise(async (resolveStudyright) => {
              await Promise.all([
                elements.map(({ code }) => (
                  new Promise(async (resolveElement) => {
                    if (allStudyprogramCodes.has(code)) {
                      await db.userStudyProgram.create({
                        user_id: newUser.id,
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

        req.user = newUser
        return next()
      }

      const newUser = await db.user.create({
        ...defaultParams,
      })

      req.user = newUser
      return next()
    } catch (e) {
      console.log(e)
      return res.status(403).json({ error: 'forbidden' })
    }
  } else {
    return res.status(403).json({ error: 'forbidden' })
  }
}


module.exports = authentication
