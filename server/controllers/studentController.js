const { User, StudyProgram } = require('@models')
const logger = require('@util/logger')
const { runAutumnReclaimStatusUpdater, runSpringReclaimStatusUpdater } = require('@services/student')
const { NotFoundError, ParameterError } = require('@util/errors')

const getStudent = async (req, res) => {
  const { studentNumber } = req.params

  const student = await User.findOne({ where: { studentNumber }, include: [{ model: StudyProgram, as: 'studyPrograms' }] })
  if (!student) throw new NotFoundError('Student not found')

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
  const { studentNumber } = req.params
  const { reason } = req.body
  if (!studentNumber) throw new ParameterError('student number missing')

  const student = await User.findOne({ where: { studentNumber }, include: [{ model: StudyProgram, as: 'studyPrograms' }] })
  if (!student) throw new NotFoundError('student not found')

  await student.toggleEligibility(reason, req.user.userId)
  logger.info(`Student ${studentNumber} marked ${!student.eligible ? 'Ineligible' : 'Eligible'} by ${req.user.userId}`)
  return res.json(student)
}

const markDeviceReturned = async (req, res) => {
  const { studentNumber } = req.params
  if (!studentNumber) throw new ParameterError('student number missing')

  const student = await User.findOne({ where: { studentNumber }, include: [{ model: StudyProgram, as: 'studyPrograms' }] })
  if (!student) throw new NotFoundError('student not found')

  await student.markDeviceReturned(req.user.userId)
  logger.info(`Student ${studentNumber} device marked as returned by ${req.user.userId}`)
  return res.json(student)
}

const updateStudentStatus = async (req, res) => {
  const { studentNumber } = req.params
  const { digiSkills, enrolled } = req.body
  if (!studentNumber) throw new ParameterError('student number missing')

  const student = await User.findOne({ where: { studentNumber }, include: [{ model: StudyProgram, as: 'studyPrograms' }] })
  if (!student) throw new NotFoundError('student not found')

  await student.updateStatus(digiSkills, enrolled)
  logger.info(`Student ${studentNumber} status updated by ${req.user.userId}`)
  return res.json(student)
}

const updateStudentReclaimStatus = async (req, res) => {
  const { studentNumber } = req.params
  const { reclaimStatus } = req.body
  if (!studentNumber) throw new ParameterError('student number missing')

  const student = await User.findOne({ where: { studentNumber }, include: [{ model: StudyProgram, as: 'studyPrograms' }] })
  if (!student) throw new NotFoundError('student not found')

  await student.updateReclaimStatus(reclaimStatus)
  logger.info(`Student ${studentNumber} reclaim status updated by ${req.user.userId}`)
  return res.json(student)
}

const getStudentsForStaff = async (req, res) => {
  const { user } = req

  const userStudyProgramCodes = user.studyPrograms.map(s => s.code)
  const allStudents = await User.getStudentsForStaff(userStudyProgramCodes)
  return res.status(200).json(allStudents)
}


const getStudentsForReclaimer = async (req, res) => {
  const studentsWithReclaimStatus = await User.getStudentsWithReclaimStatus()
  return res.status(200).json(studentsWithReclaimStatus)
}

const updateAutumunReclaimStatuses = async (req, res) => {
  await runAutumnReclaimStatusUpdater()
  const studentsWithReclaimStatus = await User.getStudentsWithReclaimStatus()
  return res.status(200).json(studentsWithReclaimStatus)
}

const updateSpringReclaimStatuses = async (req, res) => {
  await runSpringReclaimStatusUpdater()
  const studentsWithReclaimStatus = await User.getStudentsWithReclaimStatus()
  return res.status(200).json(studentsWithReclaimStatus)
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
