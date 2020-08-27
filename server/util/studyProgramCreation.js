const db = require('@models')

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

module.exports = { createUserStudyprogrammes, createStaffStudyprogrammes }
