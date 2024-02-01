const { Model, DataTypes, Op } = require('sequelize')
const { sequelize } = require('@database')
const { ParameterError, ForbiddenError } = require('@util/errors')
const logger = require('@util/logger')
const ServiceStatus = require('./servicestatus')
const StudyProgram = require('./studyprogram')
const UserStudyProgram = require('./userstudyprogram')
const ApiInterface = require('./lib/apiInterface')
const { inProduction, validateSerial } = require('../util/common')

const api = new ApiInterface()

const includesValidBachelorStudyright = async (studyrights) => {
  const acceptableStudyProgramCodes = (await StudyProgram.findAll({ attributes: ['code'] })).map(({ code }) => code)
  // TODO: replace with await StudyProgram.codes()

  return !!studyrights
    .reduce((pre, { elements }) => pre.concat(elements), [])
    .find(({ code, end_date }) => acceptableStudyProgramCodes.includes(code) && new Date(end_date) > new Date().getTime())
}

const getMinMaxSemesterStartTimes = async () => {
  const { min, max } = await api.getMinMaxSemesters()
  const minSemesterStartTime = new Date(min).getTime() // 2008-07-30T21:00:00.000Z
  const maxSemesterStartTime = new Date(max).getTime() // When current semester started. Semester swaps on 31.7.

  return { minSemesterStartTime, maxSemesterStartTime }
}

const getStudyrightValidities = async (studyrights, semesterEnrollments, currentSemester) => {
  const mlu = studyrights.find(({ faculty_code }) => faculty_code === 'H50')
  const mluElements = mlu ? mlu.elements : []
  const mluStarts = mluElements.map(e => e.start_date)

  const firstStartDate = mluStarts.sort((a, b) => Date.parse(a) - Date.parse(b))[0]

  const { minSemesterStartTime, maxSemesterStartTime } = await getMinMaxSemesterStartTimes()

  let hasNewStudyright = mluElements.some(element => new Date(element.start_date).getTime() >= maxSemesterStartTime)

  // Has studyright which started before current semester.
  let hasPreviousStudyright = mluElements.some(element => new Date(element.start_date).getTime() < maxSemesterStartTime)

  const hasPre2008Studyright = mluElements.some(element => new Date(element.start_date).getTime() < minSemesterStartTime)

  const previousStudyrightIsPossiblyNew = !hasPre2008Studyright && !hasNewStudyright && hasPreviousStudyright

  const flattenEnrolments = Object.values(semesterEnrollments.data).reduce((set, obj) => set.concat(obj), [])

  if (previousStudyrightIsPossiblyNew) {
    const hasBeenPresentBefore = flattenEnrolments.some(({ semester_code, semester_enrollment_type_code }) => (
      semester_code < currentSemester && semester_enrollment_type_code !== 2))

    if (!hasBeenPresentBefore) {
      hasPreviousStudyright = false
      hasNewStudyright = true
    }
  }

  const hasValidBachelorsStudyright = await includesValidBachelorStudyright(studyrights)

  return {
    hasPreviousStudyright, hasNewStudyright, hasValidBachelorsStudyright, firstStartDate,
  }
}

const flattenEnrolmentsFor = (rights, enrollments) => rights.reduce((set, right) => set.concat(enrollments[right]), [])

class User extends Model {
  static getStudentsForStaff(userStudyProgramCodes) {
    return this.findAll({
      where: {
        studentNumber: {
          [Op.ne]: null,
        },
        '$studyPrograms.code$': {
          [Op.in]: userStudyProgramCodes,
        },
      },
      include: [{ model: StudyProgram, as: 'studyPrograms' }],
    })
  }

  static getUsers() {
    return this.findAll({ include: [{ model: StudyProgram, as: 'studyPrograms' }] })
  }

  static findUser(id) {
    return this.findOne({
      where: {
        id,
      },
      include: [{ model: StudyProgram, as: 'studyPrograms' }],
    })
  }

  static findStudent(studentNumber) {
    return this.findOne({
      where: {
        studentNumber,
      },
      include: [{ model: StudyProgram, as: 'studyPrograms' }],
    })
  }

  async isEnrolled(currentSemester) {
    const validNow = ({ startDate, endDate }) => {
      const today = new Date()
      return new Date(startDate) <= today && today <= new Date(endDate)
    }

    const studyrights = await this.getStudyRights()
    const validMatluRights = studyrights.filter(({ faculty_code, valid }) => faculty_code === 'H50' && validNow(valid))

    if (!validMatluRights || validMatluRights.length === 0) {
      return false
    }

    const semesterEnrollments = (await this.getSemesterEnrollments()).data
    // console.log(semesterEnrollments)

    const matluEnrollments = validMatluRights.reduce((set, right) => set.concat(semesterEnrollments[right.id]), [])

    // const flattenedEnrollments = semesterEnrollments[validMatluRights[0].id]
    // console.log(matluEnrollments)

    const ACCEPTABLE_TYPES = [1, 3]
    const currentAndLegit = ({ semester_code, semester_enrollment_type_code }) => semester_code === currentSemester && ACCEPTABLE_TYPES.includes(semester_enrollment_type_code)

    /*
    const leg = matluEnrollments.some(currentAndLegit)

    if (!leg) {
      const reg = matluEnrollments.find(s => s.semester_code === currentSemester)
      // console.log(reg.termRegistrationType)
      if (!['NONATTENDING', 'NEGLECTED'].includes(reg.termRegistrationType)) {
        console.log(this.studentNumber, reg.termRegistrationType)
      }
    }
    */

    return matluEnrollments.some(currentAndLegit)
  }

  async getStudyRights() {
    if (this.studyrights) return this.studyrights

    const studyrights = await api.getStudyRights(this.studentNumber)
    this.studyrights = studyrights
    return studyrights
  }

  async hasDigiSkills() {
    return api.hasDigiSkills(this.studentNumber)
  }

  async getStudytrackEnrollmentStatus(studytrackId) {
    return api.getStudytrackEnrollmentStatus(this.studentNumber, studytrackId)
  }

  async getSemesterEnrollments() {
    return api.getSemesterEnrollments(this.studentNumber)
  }

  /**
   * @param {OODI uses semesterCode, SIS uses startYear} startingSemester
   */
  async getYearsCredits(startingSemester) {
    const credits = await api.getYearsCredits(this.studentNumber, startingSemester, this.signupYear)
    return Math.floor(credits)
  }

  async checkEligibility() {
    const settings = await ServiceStatus.getObject()
    const studyrights = await this.getStudyRights()
    const semesterEnrollments = await this.getSemesterEnrollments()

    const {
      hasPreviousStudyright,
      hasNewStudyright,
      hasValidBachelorsStudyright,
      firstStartDate,
    } = await getStudyrightValidities(studyrights, semesterEnrollments, settings.currentSemester)

    const flattenEnrolments = flattenEnrolmentsFor(studyrights.map(s => s.id), semesterEnrollments.data)

    const isPresent = flattenEnrolments && flattenEnrolments.some(enrollment => (
      enrollment.semester_code === settings.currentSemester && enrollment.semester_enrollment_type_code === 1))

    // Magic number for limit of extended delivery
    const notTooOld = new Date(firstStartDate).getFullYear() >= 2019

    return {
      eligible: (!hasPreviousStudyright && hasNewStudyright && isPresent && hasValidBachelorsStudyright),
      eligibilityReasons: {
        hasValidStudyright: hasValidBachelorsStudyright,
        hasNoPreviousStudyright: !hasPreviousStudyright,
        isPresent,
        hasNotDeviceGiven: !this.hasDeviceGiven,
      },
      extendedEligible: notTooOld && (hasPreviousStudyright && isPresent && hasValidBachelorsStudyright && !this.hasDeviceGiven),
    }
  }

  async getStatus() {
    if (!inProduction) return { digiSkills: !(this.studentNumber === 'fuksi_without_digiskills'), hasEnrollments: true }
    const digiSkills = await this.hasDigiSkills()
    const studyrights = await this.getStudyRights()
    const mlu = studyrights.find(({ faculty_code }) => faculty_code === 'H50')
    const studyProgramCodes = (await StudyProgram.findAll({ attributes: ['code'] })).map(({ code }) => code)

    const enrollmentPromises = mlu ? mlu.elements.map(({ code }) => (
      new Promise(async (resolve, reject) => {
        let enrolled
        try {
          if (code === 'KH50_008') {
            // Students in Bachelor’s Programme in Science should be enrolled to any course in H50
            enrolled = (await Promise.all(studyProgramCodes.map(c => (
              new Promise(async codeRes => codeRes(await this.getStudytrackEnrollmentStatus(c)))
            )))).includes(true)
          } else if (code === 'KH50_004') {
            // Teacher students should be enrolled to their own or math programmes' courses
            enrolled = (await Promise.all(['KH50_004', 'KH50_001'].map(c => (
              new Promise(async codeRes => codeRes(await this.getStudytrackEnrollmentStatus(c)))
            )))).includes(true)
          } else {
            // Other students should be enrolled to their own programme's courses
            enrolled = await this.getStudytrackEnrollmentStatus(code)
          }
          resolve(enrolled)
        } catch (e) {
          reject(e)
        }
      })
    )) : []

    const hasEnrollments = (await Promise.all(enrollmentPromises)).filter(e => e).length > 0

    return {
      digiSkills,
      hasEnrollments,
    }
  }

  async checkAndUpdateEligibility() {
    try {
      const settings = await ServiceStatus.getObject()

      const { eligible, eligibilityReasons, extendedEligible } = await this.checkEligibility()

      if (eligible) {
        await this.createUserStudyprograms()
        this.eligible = eligible
        this.signupYear = settings.currentYear
        logger.info(`${this.studentNumber} eligibility updated automatically`)
      }

      if (extendedEligible) {
        await this.createUserStudyprograms()
        this.extendedEligible = extendedEligible
        this.signupYear = settings.currentYear
        logger.info(`${this.studentNumber} extendedEligible updated automatically`)
      }

      this.eligibilityReasons = eligibilityReasons
      await this.save()
    } catch (e) {
      logger.error(`Failed checking and updating ${this.studentNumber} eligibility`)
    }
  }

  async checkAndUpdateTaskStatuses() {
    try {
      const { digiSkills, hasEnrollments } = await this.getStatus()

      this.digiSkillsCompleted = digiSkills || this.digiSkillsCompleted
      this.courseRegistrationCompleted = hasEnrollments || this.courseRegistrationCompleted
      await this.save()
    } catch (e) {
      logger.error(`Failed checking and updating ${this.studentNumber} task statuses: ${e}`)
    }
  }

  async createStaffStudyprograms(codes) {
    const studyprograms = await StudyProgram.findAll({
      where: { code: codes },
      attributes: ['id'],
    })

    await Promise.all(studyprograms.map(p => UserStudyProgram.create({
      userId: this.id,
      studyProgramId: p.id,
    })))

    await this.reload({
      include: [
        {
          model: StudyProgram,
          as: 'studyPrograms',
          through: { attributes: [] },
          attributes: ['name', 'code', 'contactEmail', 'contactName'],
        },
      ],
    })
  }

  async createUserStudyprograms() {
    const studyrights = await this.getStudyRights()

    const allStudyprograms = await StudyProgram.findAll({
      attributes: ['id', 'code'],
    })

    const studyprogramCodeToId = allStudyprograms.reduce((acc, { id, code }) => {
      acc[code] = id
      return acc
    }, {})

    const allStudyprogramCodes = new Set(allStudyprograms.map(({ code }) => code))

    const studyrightCodes = studyrights
      .reduce((acc, { elements }) => acc.concat(elements), [])
      .reduce((acc, { code }) => acc.concat(code), [])

    await Promise.all(studyrightCodes.map(async (code) => {
      const isRelevantStudyprogram = allStudyprogramCodes.has(code)
      const isAlreadyCreated = this.studyProgram && this.studyProgram.map(c => c.code).includes(code)
      if (isRelevantStudyprogram && !isAlreadyCreated) {
        await UserStudyProgram.create({
          userId: this.id,
          studyProgramId: studyprogramCodeToId[code],
        })
      }
    }))
  }

  async updateUserStudyPrograms(studyPrograms) {
    const userStudyProgramsToDelete = []
    const userStudyProgramsToCreate = []
    Object.entries(studyPrograms).forEach(([studyProgramId, enabled]) => {
      if (enabled) userStudyProgramsToCreate.push(studyProgramId)
      else userStudyProgramsToDelete.push(studyProgramId)
    })

    await UserStudyProgram.destroy({
      where: {
        userId: this.id,
        studyProgramId: userStudyProgramsToDelete,
      },
    })

    const promises = []
    userStudyProgramsToCreate.forEach((studyProgramId) => {
      promises.push(UserStudyProgram.findOrCreate({
        where: { userId: this.id, studyProgramId },
        defaults: { userId: this.id, studyProgramId },
      }))
    })
    await Promise.all(promises)

    await this.reload({
      include: [
        {
          model: StudyProgram,
          as: 'studyPrograms',
        },
      ],
    })

    if (userStudyProgramsToCreate.length === 0) await this.update({ staff: false })
  }

  async toggleRole(role) {
    await this.update({
      [role]: !this[role],
    })
  }

  async setAdminNote(note) {
    await this.update({ adminNote: note })
  }

  async toggleEligibility(reason, togglersUserId) {
    const settings = await ServiceStatus.getObject()
    const oldEligiblity = this.eligible
    const prevNote = this.adminNote || ''
    const prefix = prevNote.length ? '\n\n' : ''
    await this.update({
      eligible: !oldEligiblity,
      signupYear: oldEligiblity ? this.signupYear : settings.currentYear,
      ...(reason ? { adminNote: prevNote.concat(`${prefix}Marked ${oldEligiblity ? 'Ineligible' : 'Eligible'} by ${togglersUserId}. Reason: ${reason}`) } : {}),
    })
  }

  async requestDevice(email, extended = false) {
    await this.update({ wantsDevice: !extended, extendedWantsDevice: extended, personalEmail: email })
  }

  async claimDevice(deviceId, deviceDistributedBy) {
    const settings = await ServiceStatus.getObject()

    const validSerial = await validateSerial(deviceId, settings)
    if (!validSerial) throw new ParameterError(`Invalid deviceId: ${deviceId}`)

    if (
      !(
        this.eligible
            && this.wantsDevice
            // && this.digiSkillsCompleted
            // && this.courseRegistrationCompleted
            && !this.deviceGivenAt
            && this.signupYear === settings.currentYear
      )
    ) {
      throw new ForbiddenError(`Student ${this.studentNumber} not eligible for device`)
    }

    const deviceData = {
      device_distributed_by: deviceDistributedBy,
      deviceSerial: deviceId.substring(settings.serialSeparatorPos),
      deviceGivenAt: new Date(),
    }

    await this.update({
      ...deviceData,
    })

    return deviceData
  }

  async markDeviceReturned(returnMarkedByUserid) {
    await this.update({
      deviceReturned: true,
      deviceReturnedAt: new Date(),
      deviceReturnedBy: returnMarkedByUserid,
    })
  }

  async updateStatus(digiSkills, enrolled) {
    await this.update({
      digiSkillsCompleted: !!digiSkills || this.digiSkillsCompleted,
      courseRegistrationCompleted: !!enrolled || this.courseRegistrationCompleted,
    })
  }

  async updateSerial(newSerial) {
    await this.update({
      deviceSerial: newSerial,
    })
  }
}

User.init(
  {
    userId: {
      type: DataTypes.STRING,
      field: 'user_id',
    },
    studentNumber: {
      type: DataTypes.STRING,
      field: 'student_number',
    },
    name: DataTypes.STRING,
    hyEmail: {
      type: DataTypes.STRING,
      field: 'hy_email',
    },
    personalEmail: {
      type: DataTypes.STRING,
      field: 'personal_email',
    },
    admin: DataTypes.BOOLEAN,
    distributor: DataTypes.BOOLEAN,
    staff: DataTypes.BOOLEAN,
    reclaimer: DataTypes.BOOLEAN,
    dateOfBirth: {
      type: DataTypes.STRING,
      field: 'date_of_birth',
    },
    device_distributed_by: {
      type: DataTypes.STRING,
      field: 'device_distributed_by',
    },
    deviceSerial: {
      type: DataTypes.STRING,
      field: 'device_serial',
    },
    deviceGivenAt: {
      type: DataTypes.DATE,
      field: 'device_given_at',
    },
    eligible: DataTypes.BOOLEAN,
    wantsDevice: {
      type: DataTypes.BOOLEAN,
      field: 'wants_device',
    },
    digiSkillsCompleted: {
      type: DataTypes.BOOLEAN,
      field: 'digi_skills_completed',
    },
    courseRegistrationCompleted: {
      type: DataTypes.BOOLEAN,
      field: 'course_registration_completed',
    },
    adminNote: {
      type: DataTypes.STRING,
      field: 'admin_note',
    },
    signupYear: {
      type: DataTypes.INTEGER,
      field: 'signup_year',
    },
    eligibilityReasons: {
      type: DataTypes.JSONB,
      field: 'eligibility_reasons',
    },
    deviceReturned: {
      type: DataTypes.BOOLEAN,
      field: 'device_returned',
    },
    deviceReturnedAt: {
      type: DataTypes.DATE,
      field: 'device_returned_at',
    },
    deviceReturnedBy: {
      type: DataTypes.STRING,
      field: 'device_returned_by',
    },
    firstYearCredits: {
      type: DataTypes.INTEGER,
      field: 'first_year_credits',
    },
    thirdYearOrLaterStudent: {
      type: DataTypes.BOOLEAN,
      field: 'third_year_or_later_student',
    },
    extendedEligible: {
      type: DataTypes.BOOLEAN,
      field: 'extended_eligible',
    },
    extendedWantsDevice: {
      type: DataTypes.BOOLEAN,
      field: 'extended_wants_device',
    },
    isStudent: {
      type: DataTypes.VIRTUAL,
      get() {
        return !!this.studentNumber
      },
      set() {
        throw new Error('Do not try to set the `isStudent` value!')
      },
    },
    hasDeviceGiven: {
      type: DataTypes.VIRTUAL,
      get() {
        return !!this.deviceGivenAt
      },
      set() {
        throw new Error('Do not try to set the `hasDeviceGiven` value!')
      },
    },
    hasCompletedAllTasks: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.digiSkillsCompleted && this.courseRegistrationCompleted
      },
      set() {
        throw new Error('Do not try to set the `hasCompletedTasks` value!')
      },
    },
    studyrights: {
      type: DataTypes.VIRTUAL,
    },
  },
  {
    sequelize,
    modelName: 'user',
    underscored: true,
    tableName: 'users',
  },
)


module.exports = User
