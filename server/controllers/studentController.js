const db = require('@models')
const { Op } = require('sequelize')
const logger = require('@util/logger')
const { updateStudentReclaimStatuses } = require('@services/student')

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

const markStudentEligible = async (req, res) => {
  try {
    const { studentNumber } = req.params
    const { reason } = req.body
    if (!studentNumber) return res.status(400).json({ error: 'student number missing' })

    const student = await db.user.findOne({ where: { studentNumber }, include: [{ model: db.studyProgram, as: 'studyPrograms' }] })
    if (!student) return res.status(404).json({ error: 'student not found' })

    const prevNote = student.adminNote || ''
    const prefix = prevNote.length ? '\n\n' : ''
    await student.update({ eligible: true, ...(reason ? { adminNote: prevNote.concat(`${prefix}Marked eligible by ${req.user.userId}. Reason: ${reason}`) } : {}) })
    logger.info(`Student ${studentNumber} marked eligible by ${req.user.userId}`)
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

    await student.update({ deviceReturned: true, reclaimStatus })

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

const getStudentsForReclaimer = async (req, res) => {
  try {
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

    return res.status(200).json(studentsWithReclaimStatus)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'there was an error getting students with reclaim status' })
  }
}

const updateReclaimStatuses = async (req, res) => {
  try {
    await updateStudentReclaimStatuses()

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

    return res.status(200).json(studentsWithReclaimStatus)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'there was an error updating student reclaim statuses' })
  }
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

module.exports = {
  getStudent,
  markStudentEligible,
  getStudentsForStaff,
  updateStudentStatus,
  markDeviceReturned,
  getStudentsForReclaimer,
  updateReclaimStatuses,
  createUserStudyprogrammes,
  updateStudentReclaimStatus,
}
