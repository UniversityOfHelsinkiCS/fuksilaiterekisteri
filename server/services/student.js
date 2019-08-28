const axios = require('axios')
const https = require('https')
const { Op } = require('sequelize')
const db = require('@models')
const logger = require('@util/logger')
const completionChecker = require('@util/completionChecker')
const { STUDENT_API_URL, STUDENT_API_TOKEN, inProduction } = require('../util/common')
const { createUserStudyprogrammes } = require('../util/authenticationMiddleware')

const userApi = axios.create({
  httpsAgent: new https.Agent({
    // TODO: FIX
    rejectUnauthorized: false,
  }),
  baseURL: STUDENT_API_URL,
  headers: {
    common: {
      Authorization: STUDENT_API_TOKEN,
    },
  },
})

const getMinMaxSemesters = async () => {
  const res = await userApi.get(`/semesters/${new Date().getTime()}`)
  return res.data
}

const getStudyRightsFor = async (studentNumber) => {
  const res = await userApi.get(`/students/${studentNumber}/studyrights`)
  return res.data
}

const getDigiSkillsFor = async studentNumber => (await Promise.all([
  userApi.get(`/students/${studentNumber}/courses/DIGI-100A`),
  userApi.get(`/students/${studentNumber}/courses/DIGI-400A`),
])).map(res => res.data).includes(true)

const getStudytrackEnrollmentStatusFor = async (studentNumber, studytrackId) => {
  const res = await userApi.get(`/students/${studentNumber}/enrolled/${studytrackId}`)
  return res.data
}

const hasEnrolledForCourse = async (studentNumber, studytrackId, courseId) => {
  const res = await userApi.get(`/students/${studentNumber}/enrolled/${studytrackId}/${courseId}`)
  return res.data
}

const getSemesterEnrollments = async (studentNumber) => {
  const res = await userApi.get(`/students/${studentNumber}/semesterEnrollments`)
  return res.data
}

const isEligible = async (studentNumber) => {
  const studyrights = await getStudyRightsFor(studentNumber)
  const semesterEnrollments = await getSemesterEnrollments(studentNumber)

  const mlu = studyrights.data.find(({ faculty_code }) => faculty_code === 'H50')
  const { min, max } = await getMinMaxSemesters()
  const minTime = new Date(min).getTime()
  const maxTime = new Date(max).getTime()
  let hasNewStudyright = false
  let hasPreviousStudyright = false
  if (mlu) {
    mlu.elements.forEach(({ start_date }) => {
      const startTime = new Date(start_date).getTime()
      if (startTime > minTime && startTime < maxTime) {
        hasPreviousStudyright = true
      }
      if (startTime >= maxTime) {
        hasNewStudyright = true
      }
    })
  }

  if (mlu && mlu.elements.length && !hasNewStudyright && hasPreviousStudyright) {
    let hasBeenPresentBefore = false
    semesterEnrollments.data.forEach(({ semester_code, semester_enrollment_type_code }) => {
      if (semester_code < 139 && semester_enrollment_type_code !== 2) {
        hasBeenPresentBefore = true
      }
    })
    if (!hasBeenPresentBefore) {
      hasPreviousStudyright = false
      hasNewStudyright = true
    }
  }

  const currentSemester = semesterEnrollments.data.find(({ semester_code }) => semester_code === 139)
  let isPresent = false
  if (currentSemester && currentSemester.semester_enrollment_type_code === 1) {
    isPresent = true
  }

  return {
    studyrights,
    eligible: (!hasPreviousStudyright && hasNewStudyright && isPresent) || (!inProduction && studentNumber === 'fuksi'),
  }
}

const getStudentStatus = async (studentNumber, studyrights) => {
  const digiSkills = await getDigiSkillsFor(studentNumber)
  const mlu = studyrights.data.find(({ faculty_code }) => faculty_code === 'H50')
  const studyProgramCodes = (await db.studyProgram.findAll({ attributes: ['code'] })).map(({ code }) => code)

  const enrollmentPromises = mlu ? mlu.elements.map(({ code }) => (
    new Promise(async (resolve) => {
      let enrolled
      if (code === 'KH50_008') {
        // Students in Bachelor’s Programme in Science should be enrolled to any course in H50
        enrolled = (await Promise.all(studyProgramCodes.map(c => (
          new Promise(async codeRes => codeRes(await getStudytrackEnrollmentStatusFor(studentNumber, c)))
        )))).includes(true)
      } else if (code === 'KH50_004') {
        // Teacher students should be enrolled to their own or math programmes' courses
        enrolled = (await Promise.all(['KH50_004', 'KH50_001'].map(c => (
          new Promise(async codeRes => codeRes(await getStudytrackEnrollmentStatusFor(studentNumber, c)))
        )))).includes(true)
      } else if (code === 'KH50_003') {
        // Chemistry students need to be enrolled for KEK402A
        enrolled = await hasEnrolledForCourse(studentNumber, 'KH50_003', 'KEK402A')
      } else {
        // Other students should be enrolled to their own programme's courses
        enrolled = await getStudytrackEnrollmentStatusFor(studentNumber, code)
      }
      resolve(enrolled)
    })
  )) : []

  const hasEnrollments = (await Promise.all(enrollmentPromises)).filter(e => e).length > 0

  return {
    digiSkills,
    hasEnrollments,
  }
}

const updateEligibleStudentStatuses = async () => {
  const targetStudents = await db.user.findAll({
    where: {
      eligible: true,
      studentNumber: {
        [Op.ne]: null,
      },
      [Op.or]: [{ digiSkillsCompleted: false }, { courseRegistrationCompleted: false }],
    },
  })

  let done = 0

  const dbPromises = []
  // Lets not bombard oodi...
  for (let i = 0; i < targetStudents.length; i++) {
    try {
      const { studyrights } = await isEligible(targetStudents[i].studentNumber) // eslint-disable-line
      const { digiSkills, hasEnrollments } = await getStudentStatus(targetStudents[i].studentNumber, studyrights) // eslint-disable-line

      dbPromises.push(
        new Promise(async (res) => { // eslint-disable-line
          try {
            const updatedStudent = await targetStudents[i].update({
              digiSkillsCompleted: digiSkills || targetStudents[i].digiSkillsCompleted,
              courseRegistrationCompleted: hasEnrollments || targetStudents[i].courseRegistrationCompleted,
            })

            await completionChecker(updatedStudent)
            logger.info(`Updated student ${++done}/${targetStudents.length}`)
            res(true)
          } catch (e) {
            logger.error(`Failed updating student ${targetStudents[i].studentNumber}`, e)
            res(false)
          }
        }),
      )
    } catch (e) {
      logger.error(`Failed fetching oodi data for student ${targetStudents[i].studentNumber}`)
    }
  }

  await Promise.all(dbPromises)
}

const checkStudentEligibilities = async () => {
  const students = await db.user.findAll({
    where: {
      studentNumber: {
        [Op.ne]: null,
      },
    },
    attributes: ['studentNumber', 'eligible'],
  })

  let amount = 0
  await Promise.all(
    students.map(({ studentNumber, eligible: prevEligible }) => (
      new Promise(async (res) => {
        const { eligible: newEligible } = await isEligible(studentNumber)
        if (newEligible !== prevEligible) {
          logger.info(`Eligibility missmatch for ${studentNumber}!`)
          amount++
        }
        res()
      })
    )),
  )

  if (!amount) logger.info('All good!')
  else logger.info(`There were ${amount} mismatches!`)
}

const updateStudentEligibility = async (studentNumber) => {
  const foundStudent = await db.user.findOne({
    where: {
      studentNumber,
    },
    include: [{ model: db.studyProgram, as: 'studyPrograms' }],
  })

  if (!foundStudent) {
    logger.info('User not found!')
    return
  }

  const eligibilityBefore = foundStudent.eligible
  const { eligible, studyrights } = await isEligible(studentNumber)
  if (foundStudent.eligible === eligible) {
    logger.info(`${studentNumber} eligibility hasn't changed.`)
    return
  }

  await createUserStudyprogrammes(studyrights, foundStudent)
  await foundStudent.update({
    eligible,
  })

  logger.info(`${studentNumber} eligibility updated successfully from ${eligibilityBefore} to ${eligible}!`)
}

module.exports = {
  getStudentStatus,
  isEligible,
  updateEligibleStudentStatuses,
  checkStudentEligibilities,
  updateStudentEligibility,
}
