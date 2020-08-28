const { StudyProgram, UserStudyProgram, User } = require('@models')

const createStaffStudyprogrammes = async (codes, user) => {
  const studyprograms = await StudyProgram.findAll({
    where: { code: codes },
    attributes: ['id'],
  })

  const promises = []
  studyprograms.forEach((p) => {
    promises.push(UserStudyProgram.create({
      userId: user.id,
      studyProgramId: p.id,
    }))
  })
  await Promise.all(promises)

  const userWithStudyPrograms = await User.findOne({
    where: { userId: user.userId },
    include: [
      {
        model: StudyProgram,
        as: 'studyPrograms',
        through: { attributes: [] },
        attributes: ['name', 'code', 'contactEmail', 'contactName'],
      },
    ],
  })

  return userWithStudyPrograms
}

const createUserStudyprogrammes = async (studyrights, user) => {
  const allStudyprograms = await StudyProgram.findAll({
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
                await UserStudyProgram.create({
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

module.exports = { createUserStudyprogrammes, createStaffStudyprogrammes }
