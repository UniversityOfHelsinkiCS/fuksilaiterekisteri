/**
 * Student service for upcoming SIS-api.
 * Mostly same as student.js, acual logic is the same. Some queries have been altered slightly due to api changes.
 */

const axios = require('axios')
const https = require('https')
const { Op } = require('sequelize')
const { differenceInYears } = require('date-fns')
const { User, StudyProgram, Email } = require('@models')
const logger = require('@util/logger')
const completionChecker = require('@util/completionChecker')
const serviceStatusController = require('@controllers/serviceStatusController')
const { createUserStudyprogrammes } = require('@util/studyProgramCreation')

const {
  STUDENT_API_URL, STUDENT_API_TOKEN, DIGI_COURSES, inProduction,
} = require('../util/common')
const mock = require('./mock')


const getServiceStatusObject = () => serviceStatusController.getServiceStatusObject().then(serviceStatusObject => serviceStatusObject)

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
  const res = await userApi.get('/semesters/min_max_semesters')
  return res.data
}

const getStudyRightsFor = async (studentNumber) => {
  if (!inProduction) return Promise.resolve(mock.findStudyrights(studentNumber))
  const res = await userApi.get(`/students/${studentNumber}/studyrights`)
  return res.data
}
const getDigiSkillsFor = async studentNumber => (await Promise.all(DIGI_COURSES.map(code => userApi.get(`/students/${studentNumber}/has_passed_course/${code}`)))).map(res => res.data).includes(true)

const getStudytrackEnrollmentStatusFor = async (studentNumber, studytrackId) => {
  const res = await userApi.get(`/students/${studentNumber}/enrolled/study_track/${studytrackId}`)
  return res.data
}

const hasEnrolledForCourse = async (studentNumber, courseId) => {
  const res = await userApi.get(`/students/${studentNumber}/enrolled/course/${courseId}`)
  return res.data
}

const getSemesterEnrollments = async (studentNumber) => {
  if (!inProduction) return Promise.resolve(mock.findSemesterEnrollments(studentNumber))
  const res = await userApi.get(`/students/${studentNumber}/semester_enrollments`)
  return res.data
}

const getYearsCredits = async (studentNumber, signUpYear) => {
  if (!inProduction) return Promise.resolve(mock.findFirstYearCredits(studentNumber))
  const res = await userApi.get(`/students/${studentNumber}/fuksi_year_credits/${signUpYear}`)
  return res.data
}

const isEligible = async (studentNumber, at) => {
  const settings = await getServiceStatusObject()
  const studyrights = await getStudyRightsFor(studentNumber)
  const semesterEnrollments = await getSemesterEnrollments(studentNumber)

  const foundStudent = await User.findOne({
    where: {
      studentNumber,
    },
  })

  const mlu = studyrights.find(({ faculty_code }) => faculty_code === 'H50')
  const { min, max } = inProduction ? await getMinMaxSemesters() : {
    min: '2008-08-01',
    max: '2019-08-01',
  }
  const minTime = new Date(min).getTime() // 2008-08-01
  const maxTime = new Date(max).getTime() // When current semester started. Semester swaps on 1.8

  let hasNewStudyright = false
  let hasPreviousStudyright = false
  let hasPre2008Studyright = false
  if (mlu) {
    mlu.elements.forEach(({ start_date }) => {
      const startTime = new Date(start_date).getTime()

      if (startTime < maxTime) {
        hasPreviousStudyright = true // Has studyright which started before current semester.
      }

      if (startTime < minTime) {
        hasPre2008Studyright = true
      }

      if (startTime >= maxTime) {
        hasNewStudyright = true // Has studyright which might have not even started yet. (Maybe true fuksi)
      }
    })
  }

  // In case a student has a new studyright that he/she has postponed
  if (mlu && mlu.elements.length && !hasPre2008Studyright && !hasNewStudyright && hasPreviousStudyright) {
    let hasBeenPresentBefore = false

    semesterEnrollments.forEach(({ semester_code, semester_enrollment_type_code }) => {
      if (semester_code < settings.currentSemester && semester_enrollment_type_code !== 2) {
        hasBeenPresentBefore = true
      }
    })

    if (!hasBeenPresentBefore) {
      hasPreviousStudyright = false
      hasNewStudyright = true
    }
  }

  const currentSemester = semesterEnrollments.find(({ semester_code }) => semester_code === settings.currentSemester)

  let isPresent = false
  if (currentSemester && currentSemester.semester_enrollment_type_code === 1) {
    isPresent = true
  }

  const registrationEndingTime = new Date(settings.registrationDeadline)
  const didRegisterBeforeEndingTime = new Date(at || new Date().getTime()).getTime() < registrationEndingTime.getTime()

  // Student's account may have not yet been created.
  const signedUpForFreshmanDeviceThisYear = foundStudent ? foundStudent.signupYear === settings.currentYear : true

  if (!inProduction) {
    console.log('hasPreviousStudyright            \t', hasPreviousStudyright)
    console.log('hasNewStudyright                 \t', hasNewStudyright)
    console.log('isPresent                        \t', isPresent)
    console.log('didRegisterBeforeEndingTime      \t', didRegisterBeforeEndingTime)
    console.log('signedUpForFreshmanDeviceThisYear\t', signedUpForFreshmanDeviceThisYear)
  }

  if (!inProduction) {
    return {
      studyrights,
      eligible: !hasPreviousStudyright && hasNewStudyright && isPresent && didRegisterBeforeEndingTime && signedUpForFreshmanDeviceThisYear,
      eligibilityReasons: {
        hasValidStudyright: !hasPreviousStudyright && hasNewStudyright,
        isPresent,
        didRegisterBeforeEndingTime,
        signedUpForFreshmanDeviceThisYear,
      },
    }
  }

  return {
    studyrights,
    eligible: !hasPreviousStudyright && hasNewStudyright && isPresent && didRegisterBeforeEndingTime && signedUpForFreshmanDeviceThisYear,
    eligibilityReasons: {
      hasValidStudyright: !hasPreviousStudyright && hasNewStudyright,
      isPresent,
      didRegisterBeforeEndingTime,
      signedUpForFreshmanDeviceThisYear,
    },
  }
}

const getStudentStatus = async (studentNumber, studyrights) => {
  if (!inProduction) return { digiSkills: !(studentNumber === 'fuksi_without_digiskills'), hasEnrollments: true }
  const digiSkills = await getDigiSkillsFor(studentNumber)
  const mlu = studyrights.find(({ faculty_code }) => faculty_code === 'H50')
  const studyProgramCodes = (await StudyProgram.findAll({ attributes: ['code'] })).map(({ code }) => code)

  const enrollmentPromises = mlu
    ? mlu.elements.map(
      ({ code }) => new Promise(async (resolve) => {
        let enrolled
        if (code === 'KH50_008') {
          // Students in Bachelor’s Programme in Science should be enrolled to any course in H50
          enrolled = (await Promise.all(studyProgramCodes.map(c => new Promise(async codeRes => codeRes(await getStudytrackEnrollmentStatusFor(studentNumber, c)))))).includes(true)
        } else if (code === 'KH50_004') {
          // Teacher students should be enrolled to their own or math programmes' courses
          enrolled = (await Promise.all(['KH50_004', 'KH50_001'].map(c => new Promise(async codeRes => codeRes(await getStudytrackEnrollmentStatusFor(studentNumber, c)))))).includes(true)
        } else if (code === 'KH50_003') {
          // Chemistry students need to be enrolled for KEK402A
          enrolled = await hasEnrolledForCourse(studentNumber, 'KEK402A')
        } else {
          // Other students should be enrolled to their own programme's courses
          enrolled = await getStudytrackEnrollmentStatusFor(studentNumber, code)
        }
        resolve(enrolled)
      }),
    )
    : []

  const hasEnrollments = (await Promise.all(enrollmentPromises)).filter(e => e).length > 0

  return {
    digiSkills,
    hasEnrollments,
  }
}

const updateEligibleStudentStatuses = async () => {
  const settings = await getServiceStatusObject()
  const isDistributionOver = new Date().getTime() > new Date(settings.taskDeadline).getTime()
  if (isDistributionOver) return

  const targetStudents = await User.findAll({
    where: {
      eligible: true,
      studentNumber: {
        [Op.ne]: null,
      },
      [Op.or]: [{ digiSkillsCompleted: false }, { courseRegistrationCompleted: false }],
      signupYear: settings.currentYear,
    },
  })

  const readyEmail = await Email.findOne({ where: { type: 'AUTOSEND_WHEN_READY' } })

  let done = 0

  const dbPromises = []
  // Lets not bombard oodi...
  for (let i = 0; i < targetStudents.length; i++) {
    try {
      const { studyrights } = await isEligible(targetStudents[i].studentNumber, targetStudents[i].createdAt) // eslint-disable-line
      const { digiSkills, hasEnrollments } = await getStudentStatus(targetStudents[i].studentNumber, studyrights) // eslint-disable-line

      dbPromises.push(
        new Promise(async (res) => { // eslint-disable-line
          try {
            const updatedStudent = await targetStudents[i].update({
              digiSkillsCompleted: digiSkills || targetStudents[i].digiSkillsCompleted,
              courseRegistrationCompleted: hasEnrollments || targetStudents[i].courseRegistrationCompleted,
            })

            await completionChecker(updatedStudent, readyEmail)
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
  const settings = await getServiceStatusObject()
  const students = await User.findAll({
    where: {
      studentNumber: {
        [Op.ne]: null,
      },
      signupYear: settings.currentYear,
    },
    attributes: ['studentNumber', 'eligible', 'createdAt'],
  })

  let amount = 0
  let mismatches = 0
  // Lets not bombard oodi...
  for (let i = 0; i < students.length; i++) {
    const { eligible } = await isEligible(students[i].studentNumber, students[i].createdAt) // eslint-disable-line
    if (eligible !== students[i].eligible) {
      logger.info(`Eligibility missmatch for ${students[i].studentNumber}!`)
      mismatches++
    }
    amount++
    logger.info(`${amount}/${students.length}`)
  }

  if (!mismatches) logger.info('All good!')
  else logger.info(`There were ${mismatches} mismatches!`)
}

const updateStudentEligibility = async (studentNumber) => {
  const foundStudent = await User.findOne({
    where: {
      studentNumber,
    },
    include: [{ model: StudyProgram, as: 'studyPrograms' }],
  })

  if (!foundStudent) {
    logger.info('User not found!')
    return
  }

  const eligibilityBefore = foundStudent.eligible
  const { eligible, studyrights } = await isEligible(studentNumber, foundStudent.createdAt)
  if (foundStudent.eligible === eligible) {
    logger.info(`${studentNumber} eligibility hasn't changed.`)
    return
  }

  await createUserStudyprogrammes(studyrights, foundStudent)
  const updatedStudent = await foundStudent.update({
    eligible,
  })

  logger.info(`${studentNumber} eligibility updated successfully from ${eligibilityBefore} to ${eligible}!`)
  const readyEmail = await Email.findOne({ where: { type: 'AUTOSEND_WHEN_READY' } })
  await completionChecker(updatedStudent, readyEmail)
}

const isDeviceHeldUnderFiveYears = deviceGivenAt => differenceInYears(new Date(), new Date(deviceGivenAt)) < 5

const isPresent = async (studentNumber, currentSemester) => {
  const semesterEnrollments = await getSemesterEnrollments(studentNumber)
  const currentSemesterEnrollment = semesterEnrollments.data.find(({ semester_code }) => semester_code === currentSemester)

  return currentSemesterEnrollment && currentSemesterEnrollment.semester_enrollment_type_code === 1
}

const getFallSemesterCode = year => (year - 1950) * 2 + 1
const getSpringSemesterCode = year => (year - 1950) * 2
const getCurrentYear = () => (inProduction ? new Date().getFullYear() : 2019)

const getFirstYearCredits = async (studentNumber, signUpYear) => {
  const credits = await getYearsCredits(studentNumber, signUpYear)
  return credits
}

const FIRST_YEAR_CREDIT_LIMIT = 30

const runAutumnReclaimStatusUpdater = async () => {
  const currentYear = getCurrentYear()

  const deviceHolders = await User.findAll({
    where: {
      deviceSerial: { [Op.ne]: null },
      deviceReturned: false,
      signupYear: { [Op.not]: currentYear },
    },
  })

  const dbPromises = []
  for (let i = 0; i < deviceHolders.length; i++) {
    try {
      const present = await isPresent(deviceHolders[i].studentNumber, getFallSemesterCode(currentYear)) // eslint-disable-line

      const thirdYearOrLaterStudent = currentYear - deviceHolders[i].signupYear > 1

      const firstYearCredits = thirdYearOrLaterStudent ? deviceHolders[i].firstYearCredits : await getFirstYearCredits(deviceHolders[i].studentNumber, deviceHolders[i].signupYear) // eslint-disable-line

      const reclaimActionNeeded = !present || (!thirdYearOrLaterStudent && firstYearCredits < FIRST_YEAR_CREDIT_LIMIT)

      const reclaimStatus = reclaimActionNeeded && deviceHolders[i].reclaimStatus !== 'CONTACTED' ? 'OPEN' : deviceHolders[i].reclaimStatus

      dbPromises.push(
        new Promise(async (res) => {
          // eslint-disable-line
          try {
            await deviceHolders[i].update({
              reclaimStatus,
              present,
              firstYearCredits,
              thirdYearOrLaterStudent,
            })
            res(true)
          } catch (e) {
            logger.error(`Failed updating student reclaim status ${deviceHolders[i].studentNumber}`, e)
            res(false)
          }
        }),
      )
    } catch (e) {
      logger.error(`Failed fetching oodi data for student ${deviceHolders[i].studentNumber}`)
    }
  }

  await Promise.all(dbPromises)
}

const runSpringReclaimStatusUpdater = async () => {
  const currentYear = getCurrentYear()

  const deviceHolders = await User.findAll({
    where: {
      deviceSerial: { [Op.ne]: null },
      deviceReturned: false,
    },
  })

  const dbPromises = []
  for (let i = 0; i < deviceHolders.length; i++) {
    try {
      const deviceHeldUnderFiveYears = isDeviceHeldUnderFiveYears(deviceHolders[i].deviceGivenAt)
      const present = await isPresent(deviceHolders[i].studentNumber, getSpringSemesterCode(currentYear)) // eslint-disable-line

      const reclaimActionNeeded = !deviceHeldUnderFiveYears || !present

      const reclaimStatus = reclaimActionNeeded && deviceHolders[i].reclaimStatus !== 'CONTACTED' ? 'OPEN' : deviceHolders[i].reclaimStatus

      dbPromises.push(
        new Promise(async (res) => {
          // eslint-disable-line
          try {
            await deviceHolders[i].update({
              reclaimStatus,
              present,
              deviceReturnDeadlinePassed: !deviceHeldUnderFiveYears,
            })
            res(true)
          } catch (e) {
            logger.error(`Failed updating student reclaim status ${deviceHolders[i].studentNumber}`, e)
            res(false)
          }
        }),
      )
    } catch (e) {
      logger.error(`Failed fetching oodi data for student ${deviceHolders[i].studentNumber}`)
    }
  }

  await Promise.all(dbPromises)
}

module.exports = {
  getStudentStatus,
  isEligible,
  updateEligibleStudentStatuses,
  checkStudentEligibilities,
  updateStudentEligibility,
  runAutumnReclaimStatusUpdater,
  runSpringReclaimStatusUpdater,
}
