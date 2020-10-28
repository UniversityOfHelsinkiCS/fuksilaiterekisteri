const { Op } = require('sequelize')
const { differenceInYears } = require('date-fns')
const { User, ServiceStatus } = require('@models')
const logger = require('@util/logger')
const completionChecker = require('@util/completionChecker')

const {
  inProduction,
} = require('../util/common')

const printProgress = (identifier, progress, total) => {
  if (progress % Math.floor((total / 10)) === 0) {
    logger.info(`${identifier} ${Math.floor((progress) / total * 100)}% done`)
  }
}

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

  await targetStudents.reduce(async (promise, student, index) => {
    await promise // We don't want to spam oodi api so we wait for previous to resolve

    try {
      const { digiSkills, hasEnrollments } = await student.getStatus()

      try {
        const statusChanged = student.digiSkillsCompleted !== digiSkills || student.courseRegistrationCompleted !== hasEnrollments
        if (statusChanged) {
          const updatedStudent = await student.update({
            digiSkillsCompleted: digiSkills || student.digiSkillsCompleted,
            courseRegistrationCompleted: hasEnrollments || student.courseRegistrationCompleted,
          })
          await completionChecker(updatedStudent)
          logger.info(`Updated statuses for student ${student.studentNumber}`)
        }
        printProgress('Updating eligible student statuses', index + 1, targetStudents.length)
      } catch (e) {
        logger.error(`Failed updating student ${student.studentNumber}`, e)
      }
    } catch (e) {
      logger.error(`Failed fetching oodi data for student ${student.studentNumber}`)
      console.log(e.stack) // eslint-disable-line no-console
    }
  }, Promise.resolve())
  logger.info('Done updating eligible student statuses.')
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

  const mismatches = await students.reduce(async (promise, student, index) => {
    let currentMismatches = await promise // We don't want to spam oodi api so we wait for previous to resolve

    try {
      const { eligible } = await student.checkEligibility()
      if (eligible !== student.eligible) {
        logger.info(`Eligibility missmatch for ${student.studentNumber}!`)
        currentMismatches++
      }
      printProgress('Checking student eligiblitities', index + 1, students.length)
    } catch (e) {
      logger.info(`Failed checking eligiblity for ${student.studentNumber}`)
      console.log(e.stack) // eslint-disable-line no-console
    }

    return currentMismatches
  }, Promise.resolve(0))

  if (!mismatches) logger.info('All good!')
  else logger.info(`There were ${mismatches} mismatches!`)
}

// Used in CLI
const updateStudentEligibility = async (studentNumber) => {
  const foundStudent = await User.findStudent(studentNumber)

  if (!foundStudent) {
    logger.info('User not found!')
    return
  }

  const eligibilityBefore = foundStudent.eligible
  const { eligible } = await foundStudent.checkEligibility()
  if (foundStudent.eligible === eligible) {
    logger.info(`${studentNumber} eligibility hasn't changed.`)
    return
  }

  await foundStudent.createUserStudyprograms()
  const settings = await ServiceStatus.getObject()
  const updatedStudent = await foundStudent.update({
    eligible,
    signupYear: eligible ? settings.currentYear : foundStudent.signupYear,
  })

  logger.info(`${studentNumber} eligibility updated successfully from ${eligibilityBefore} to ${eligible}!`)
  await completionChecker(updatedStudent)
}

const isDeviceHeldUnderFiveYears = deviceGivenAt => differenceInYears(new Date(), new Date(deviceGivenAt)) < 5

const isPresent = async (student, currentSemester) => {
  const semesterEnrollments = await student.getSemesterEnrollments()
  const currentSemesterEnrollment = semesterEnrollments.data.find(({ semester_code }) => semester_code === currentSemester)

  return !!(currentSemesterEnrollment && currentSemesterEnrollment.semester_enrollment_type_code === 1)
}

const getFallSemesterCode = year => (year - 1950) * 2 + 1
const getSpringSemesterCode = year => (year - 1950) * 2
const getCurrentYear = () => (inProduction ? new Date().getFullYear() : 2019)

const getFirstYearCredits = async (student) => {
  const semesterCode = getFallSemesterCode(student.signupYear)
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

  logger.info(`Checking reclaim status for ${deviceHolders.length} students`)

  await deviceHolders.reduce(async (promise, student) => {
    await promise // We don't want to spam oodi api so we wait for previous to resolve

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
      console.log(e.stack) // eslint-disable-line no-console
    }
  }, Promise.resolve())
}

const runSpringReclaimStatusUpdater = async () => {
  const currentYear = getCurrentYear()

  const deviceHolders = await User.findAll({
    where: {
      deviceSerial: { [Op.ne]: null },
      deviceReturned: false,
    },
  })

  logger.info(`Checking reclaim status for ${deviceHolders.length} students`)

  await deviceHolders.reduce(async (promise, student) => {
    await promise // We don't want to spam oodi api so we wait for previous to resolve

    try {
      const deviceHeldUnderFiveYears = isDeviceHeldUnderFiveYears(student.deviceGivenAt)
      const present = await isPresent(student, getSpringSemesterCode(currentYear))

      const reclaimActionNeeded = !deviceHeldUnderFiveYears || !present

      const reclaimStatus = reclaimActionNeeded && student.reclaimStatus !== 'CONTACTED' ? 'OPEN' : student.reclaimStatus

      try {
        await student.update({
          reclaimStatus,
          present,
          deviceReturnDeadlinePassed: !deviceHeldUnderFiveYears,
        })
      } catch (e) {
        logger.error(`Failed updating student reclaim status ${student.studentNumber}`, e)
      }
    } catch (e) {
      logger.error(`Failed fetching oodi data for student ${student.studentNumber}`)
      console.log(e.stack) // eslint-disable-line no-console
    }
  }, Promise.resolve())
}

module.exports = {
  updateEligibleStudentStatuses,
  checkStudentEligibilities,
  updateStudentEligibility,
  runAutumnReclaimStatusUpdater,
  runSpringReclaimStatusUpdater,
}
