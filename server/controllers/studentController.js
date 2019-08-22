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

const markStudentEligible = async (req, res) => {
  try {
    const { studentNumber } = req.params
    if (!studentNumber) return res.status(400).json({ error: 'student number missing' })

    const student = await db.user.findOne({ where: { studentNumber }, attributes: ['name', 'hyEmail', 'studentNumber', 'eligible', 'digiSkillsCompleted', 'deviceGivenAt', 'deviceSerial', 'device_distributed_by', 'id', 'staff', 'distributor'] })
    if (!student) return res.status(404).json({ error: 'student not found' })

    await student.update({ eligible: true })

    return res.json(student)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

module.exports = {
  getStudent,
  markStudentEligible,
}
