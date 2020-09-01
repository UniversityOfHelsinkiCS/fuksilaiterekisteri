const { Op } = require('sequelize')
const { differenceInYears } = require('date-fns')
const {
  StudyProgram, User, Email, ServiceStatus,
} = require('@models')
const logger = require('@util/logger')
const completionChecker = require('@util/completionChecker')
const { createUserStudyprogrammes } = require('@util/studyProgramCreation')

const {
  inProduction,
} = require('../util/common')


const updateEligibleStudentStatuses = async () => {
  const settings = await ServiceStatus.getObject()
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
      const { digiSkills, hasEnrollments } = await targetStudents[i].getStatus() // eslint-disable-line

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
  const settings = await ServiceStatus.getObject()
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
    const { eligible } = await students[i].isEligible(students[i].createdAt) // eslint-disable-line
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

// Used in CLI
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
  const { eligible, studyrights } = await foundStudent.isEligible(foundStudent.createdAt)
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

const checkAndUpdateEligibility = async (user) => {
  try {
    const settings = await ServiceStatus.getObject()

    const { studyrights, eligible, eligibilityReasons } = await user.isEligible()

    if (eligible) {
      await createUserStudyprogrammes(studyrights, user)
      await user.update({
        eligible,
        eligibilityReasons,
        signupYear: settings.currentYear,
      })
      logger.info(`${user.studentNumber} eligibility updated automatically`)
    } else {
      await user.update({ eligibilityReasons })
    }
  } catch (e) {
    logger.error(`Failed checking and updating ${user.studentNumber} eligibility`)
  }
  return user
}

const checkAndUpdateTaskStatuses = async (user) => {
  try {
    const { digiSkills, hasEnrollments } = await user.getStatus()

    if (digiSkills !== user.digiSkillsCompleted || hasEnrollments !== user.courseRegistrationCompleted) {
      await user.update({
        digiSkillsCompleted: digiSkills || user.digiSkillsCompleted,
        courseRegistrationCompleted: hasEnrollments || user.courseRegistrationCompleted,
      })

      const readyEmail = await Email.findOne({
        where: { type: 'AUTOSEND_WHEN_READY' },
      })
      await completionChecker(user, readyEmail)
    }
  } catch (e) {
    logger.error(`Failed checking and updating ${user.studentNumber} task statuses: ${e}`)
  }
  return user
}

const isDeviceHeldUnderFiveYears = deviceGivenAt => differenceInYears(new Date(), new Date(deviceGivenAt)) < 5

const isPresent = async (student, currentSemester) => {
  const semesterEnrollments = await student.getSemesterEnrollments()
  const currentSemesterEnrollment = semesterEnrollments.data.find(({ semester_code }) => semester_code === currentSemester)

  return currentSemesterEnrollment && currentSemesterEnrollment.semester_enrollment_type_code === 1
}

const getFallSemesterCode = year => (year - 1950) * 2 + 1
const getSpringSemesterCode = year => (year - 1950) * 2
const getCurrentYear = () => (inProduction ? new Date().getFullYear() : 2019)

const getFirstYearCredits = async (student) => {
  const semesterCode = getFallSemesterCode(student.signUpYear)
  const credits = await student.getYearsCredits(semesterCode)
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

  const dbPromises = deviceHolders.map(async (student) => {
    try {
      const present = await isPresent(student, getFallSemesterCode(currentYear))

      const thirdYearOrLaterStudent = currentYear - student.signupYear > 1

      const firstYearCredits = thirdYearOrLaterStudent
        ? student.firstYearCredits
        : await getFirstYearCredits(student)

      const reclaimActionNeeded = !present || (!thirdYearOrLaterStudent && firstYearCredits < FIRST_YEAR_CREDIT_LIMIT)

      const reclaimStatus = reclaimActionNeeded && student.reclaimStatus !== 'CONTACTED' ? 'OPEN' : student.reclaimStatus

      try {
        await student.update({
          reclaimStatus,
          present,
          firstYearCredits,
          thirdYearOrLaterStudent,
        })
      } catch (e) {
        logger.error(`Failed updating student reclaim status ${student.studentNumber}`, e)
      }
    } catch (e) {
      logger.error(`Failed fetching oodi data for student ${student.studentNumber}`)
    }
  })

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
      const present = await isPresent(deviceHolders[i], getSpringSemesterCode(currentYear)) // eslint-disable-line

      const reclaimActionNeeded = !deviceHeldUnderFiveYears || !present

      const reclaimStatus = reclaimActionNeeded && deviceHolders[i].reclaimStatus !== 'CONTACTED' ? 'OPEN' : deviceHolders[i].reclaimStatus

      dbPromises.push(
        new Promise(async (res) => { // eslint-disable-line
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
  updateEligibleStudentStatuses,
  checkStudentEligibilities,
  updateStudentEligibility,
  runAutumnReclaimStatusUpdater,
  runSpringReclaimStatusUpdater,
  checkAndUpdateEligibility,
  checkAndUpdateTaskStatuses,
}
