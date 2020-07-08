const db = require('@models')
const logger = require('@util/logger')

const getAll = async (req, res) => {
  try {
    const studyProgrammes = await db.studyProgram.findAll()
    return res.status(200).json(studyProgrammes.sort((a, b) => a.name > b.name))
  } catch (e) {
    logger.error('error', e)
    return res.status(500).json({ error: 'error' })
  }
}

const update = async (req, res) => {
  try {
    const newData = req.body

    const studyProgrammes = await db.studyProgram.findAll()

    const promises = []
    newData.forEach(({ code, contactEmail, contactName }) => {
      const temp = studyProgrammes.find(p => p.code === code)
      temp.contactEmail = contactEmail
      temp.contactName = contactName
      promises.push(temp.save())
    })

    await Promise.all(promises)

    return res.status(200).json(studyProgrammes.sort((a, b) => a.name > b.name))
  } catch (e) {
    logger.error('error', e)
    return res.status(500).json({ error: 'error' })
  }
}


module.exports = {
  getAll,
  update,
}
