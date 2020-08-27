const db = require('@models')
const { Op } = require('sequelize')
const logger = require('@util/logger')
const { runAutumnReclaimStatusUpdater, runSpringReclaimStatusUpdater } = require('@services/student')
const { getServiceStatusObject } = require('./serviceStatusController')

const getStudent = async (req, res) => {
  const { studentNumber } = req.params

  const student = await db.user.findOne({ where: { studentNumber }, include: [{ model: db.studyProgram, as: 'studyPrograms' }] })
  if (!student) return res.sendStatus(404)

  const response = {
    studentNumber: student.studentNumber,
    name: student.name,
    dateOfBirth: student.dateOfBirth,
    eligible: student.eligible,
    digiSkillsCompleted: student.digiSkillsCompleted,
    courseRegistrationCompleted: student.courseRegistrationCompleted,
    wantsDevice: student.wantsDevice,
    studyPrograms: student.studyPrograms.map(s => ({
      name: s.name,
      code: s.code,
    })),
    deviceGivenAt: student.deviceGivenAt,
    signupYear: student.signupYear,
  }

  return res.send(response)
}

const toggleStudentEligibility = async (req, res) => {
  try {
    const { studentNumber } = req.params
    const { reason } = req.body
    if (!studentNumber) return res.status(400).json({ error: 'student number missing' })

    const student = await db.user.findOne({ where: { studentNumber }, include: [{ model: db.studyProgram, as: 'studyPrograms' }] })
    if (!student) return res.status(404).json({ error: 'student not found' })

    const settings = await getServiceStatusObject()

    const oldEligiblity = student.eligible
    const prevNote = student.adminNote || ''
    const prefix = prevNote.length ? '\n\n' : ''
    await student.update({
      eligible: !oldEligiblity,
      signupYear: oldEligiblity ? student.signupYear : settings.currentYear,
      ...(reason ? { adminNote: prevNote.concat(`${prefix}Marked ${oldEligiblity ? 'Ineligible' : 'Eligible'} by ${req.user.userId}. Reason: ${reason}`) } : {}),
    })
    logger.info(`Student ${studentNumber} marked ${oldEligiblity ? 'Ineligible' : 'Eligible'} by ${req.user.userId}`)
    return res.json(student)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const markDeviceReturned = async (req, res) => {
  try {
    const { studentNumber } = req.params
    if (!studentNumber) return res.status(400).json({ error: 'student number missing' })

    const student = await db.user.findOne({ where: { studentNumber }, include: [{ model: db.studyProgram, as: 'studyPrograms' }] })
    if (!student) return res.status(404).json({ error: 'student not found' })

    const reclaimStatus = student.reclaimStatus ? 'CLOSED' : null

    await student.update({
      deviceReturned: true,
      deviceReturnedAt: new Date(),
      deviceReturnedBy: req.user.userId,
      reclaimStatus,
    })

    logger.info(`Student ${studentNumber} device marked as returned by ${req.user.userId}`)
    return res.json(student)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const updateStudentStatus = async (req, res) => {
  try {
    const { studentNumber } = req.params
    const { digiSkills, enrolled } = req.body

    if (!studentNumber) return res.status(400).json({ error: 'student number missing' })

    const student = await db.user.findOne({ where: { studentNumber }, include: [{ model: db.studyProgram, as: 'studyPrograms' }] })
    if (!student) return res.status(404).json({ error: 'student not found' })

    await student.update({
      digiSkillsCompleted: !!digiSkills || student.digiSkillsCompleted,
      courseRegistrationCompleted: !!enrolled || student.courseRegistrationCompleted,
    })
    logger.info(`Student ${studentNumber} status updated by ${req.user.userId}`)
    return res.json(student)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const updateStudentReclaimStatus = async (req, res) => {
  try {
    const { studentNumber } = req.params
    const { reclaimStatus } = req.body

    if (!studentNumber) return res.status(400).json({ error: 'student number missing' })

    const student = await db.user.findOne({ where: { studentNumber }, include: [{ model: db.studyProgram, as: 'studyPrograms' }] })
    if (!student) return res.status(404).json({ error: 'student not found' })

    await student.update({ reclaimStatus })
    logger.info(`Student ${studentNumber} reclaim status updated by ${req.user.userId}`)
    return res.json(student)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const getStudentsForStaff = async (req, res) => {
  try {
    const { user } = req

    const userStudyProgramCodes = user.studyPrograms.map(s => s.code)
    const allStudents = await db.user.findAll({
      where: {
        studentNumber: {
          [Op.ne]: null,
        },
        '$studyPrograms.code$': {
          [Op.in]: userStudyProgramCodes,
        },
      },
      include: [{ model: db.studyProgram, as: 'studyPrograms' }],
    })

    return res.status(200).json(allStudents)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const getStudentsWithReclaimStatus = async () => {
  const studentsWithReclaimStatus = await db.user.findAll({
    where: {
      studentNumber: {
        [Op.ne]: null,
      },
      reclaimStatus: {
        [Op.ne]: null,
      },
    },
    include: [{ model: db.studyProgram, as: 'studyPrograms' }],
  })

  return studentsWithReclaimStatus
}

const getStudentsForReclaimer = async (req, res) => {
  try {
    const studentsWithReclaimStatus = await getStudentsWithReclaimStatus()

    return res.status(200).json(studentsWithReclaimStatus)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'there was an error getting students with reclaim status' })
  }
}

const updateAutumunReclaimStatuses = async (req, res) => {
  try {
    await runAutumnReclaimStatusUpdater()

    const studentsWithReclaimStatus = await getStudentsWithReclaimStatus()

    return res.status(200).json(studentsWithReclaimStatus)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'there was an error updating student reclaim statuses' })
  }
}

const updateSpringReclaimStatuses = async (req, res) => {
  try {
    await runSpringReclaimStatusUpdater()

    const studentsWithReclaimStatus = await getStudentsWithReclaimStatus()

    return res.status(200).json(studentsWithReclaimStatus)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'there was an error updating student reclaim statuses' })
  }
}

module.exports = {
  getStudent,
  toggleStudentEligibility,
  getStudentsForStaff,
  updateStudentStatus,
  markDeviceReturned,
  getStudentsForReclaimer,
  updateStudentReclaimStatus,
  updateAutumunReclaimStatuses,
  updateSpringReclaimStatuses,
}
