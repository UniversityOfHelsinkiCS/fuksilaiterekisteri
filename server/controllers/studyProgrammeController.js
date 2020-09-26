const { StudyProgram } = require('@models')

const getAll = async (req, res) => {
  const studyProgrammes = await StudyProgram.findAll()
  return res.status(200).json(studyProgrammes.sort((a, b) => a.name > b.name))
}

const update = async (req, res) => {
  const newData = req.body

  const studyProgrammes = await StudyProgram.findAll()

  const promises = []
  newData.forEach(({ code, contactEmail, contactName }) => {
    const temp = studyProgrammes.find(p => p.code === code)
    temp.contactEmail = contactEmail
    temp.contactName = contactName
    promises.push(temp.save())
  })

  await Promise.all(promises)

  return res.status(200).json(studyProgrammes.sort((a, b) => a.name > b.name))
}


module.exports = {
  getAll,
  update,
}
