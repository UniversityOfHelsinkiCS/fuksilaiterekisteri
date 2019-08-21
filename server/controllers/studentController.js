const db = require('@models')

const getStudent = async (req, res) => {
  const { studentNumber } = req.params

  const student = await db.user.findOne({ where: { studentNumber } })
  if (!student) return res.sendStatus(404)

  const response = {
    studentNumber: student.studentNumber,
    name: student.name,
    dateOfBirth: student.dateOfBirth,
  }

  return res.send(response)
}


module.exports = {
  getStudent,
}
