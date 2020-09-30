const { Model, DataTypes, Op } = require('sequelize')
const { sequelize } = require('@database')
const { ParameterError, ForbiddenError } = require('@util/errors')
const ServiceStatus = require('./servicestatus')
const StudyProgram = require('./studyprogram')
const UserStudyProgram = require('./userstudyprogram')
const ApiInterface = require('./lib/apiInterface')
const { inProduction, validateSerial } = require('../util/common')

const api = new ApiInterface()

class User extends Model {
  static async markUsersContacted(userIds) {
    await this.update({ reclaimStatus: 'CONTACTED' }, { where: { userId: userIds } })
  }

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

  static getStudentsWithReclaimStatus() {
    return this.findAll({
      where: {
        studentNumber: {
          [Op.ne]: null,
        },
        reclaimStatus: {
          [Op.ne]: null,
        },
      },
      include: [{ model: StudyProgram, as: 'studyPrograms' }],
    })
  }

  async getStudyRights() {
    return api.getStudyRights(this.studentNumber)
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
    return api.getYearsCredits(this.studentNumber, startingSemester, this.signupYear)
  }

  async isEligible(at) {
    const settings = await ServiceStatus.getObject()
    const studyrights = await this.getStudyRights()
    const semesterEnrollments = await this.getSemesterEnrollments()
    const acceptableStudyProgramCodes = (await StudyProgram.findAll({ attributes: ['code'] })).map(({ code }) => code)

    const mlu = studyrights.data.find(({ faculty_code }) => faculty_code === 'H50')
    const { min, max } = inProduction ? await api.getMinMaxSemesters() : {
      min: '2008-07-30T21:00:00.000Z',
      max: `${settings.currentYear}-07-31T21:00:00.000Z`,
    }
    const minTime = new Date(min).getTime() // 2008-07-30T21:00:00.000Z
    const maxTime = new Date(max).getTime() // When current semester started. Semester swaps on 31.7.

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

    const hasValidBachelorsStudyright = !!studyrights.data
      .reduce((pre, { elements }) => pre.concat(elements), [])
      .find(({ code, end_date }) => acceptableStudyProgramCodes.includes(code) && new Date(end_date) > new Date().getTime())

    // In case a student has a new studyright that he/she has postponed
    if (mlu && mlu.elements.length && !hasPre2008Studyright && !hasNewStudyright && hasPreviousStudyright) {
      let hasBeenPresentBefore = false

      semesterEnrollments.data.forEach(({ semester_code, semester_enrollment_type_code }) => {
        if (semester_code < settings.currentSemester && semester_enrollment_type_code !== 2) {
          hasBeenPresentBefore = true
        }
      })

      if (!hasBeenPresentBefore) {
        hasPreviousStudyright = false
        hasNewStudyright = true
      }
    }

    const currentSemester = semesterEnrollments.data.find(({ semester_code }) => semester_code === settings.currentSemester)

    let isPresent = false
    if (currentSemester && currentSemester.semester_enrollment_type_code === 1) {
      isPresent = true
    }

    const registrationEndingTime = new Date(settings.registrationDeadline)
    const didRegisterBeforeEndingTime = new Date(at || new Date().getTime()).getTime() < registrationEndingTime.getTime()

    return {
      studyrights,
      eligible: (!hasPreviousStudyright && hasNewStudyright && isPresent && didRegisterBeforeEndingTime && hasValidBachelorsStudyright),
      eligibilityReasons: {
        hasValidStudyright: hasValidBachelorsStudyright,
        hasNoPreviousStudyright: !hasPreviousStudyright,
        isPresent,
        didRegisterBeforeEndingTime,
      },
    }
  }

  async getStatus() {
    if (!inProduction) return { digiSkills: !(this.studentNumber === 'fuksi_without_digiskills'), hasEnrollments: true }
    const digiSkills = await this.hasDigiSkills()
    const studyrights = await this.getStudyRights()
    const mlu = studyrights.data.find(({ faculty_code }) => faculty_code === 'H50')
    const studyProgramCodes = (await StudyProgram.findAll({ attributes: ['code'] })).map(({ code }) => code)

    const enrollmentPromises = mlu ? mlu.elements.map(({ code }) => (
      new Promise(async (resolve) => {
        let enrolled
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
      })
    )) : []

    const hasEnrollments = (await Promise.all(enrollmentPromises)).filter(e => e).length > 0

    return {
      digiSkills,
      hasEnrollments,
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

  async createUserStudyprograms(studyrights) {
    const allStudyprograms = await StudyProgram.findAll({
      attributes: ['id', 'code'],
    })

    const studyprogramCodeToId = allStudyprograms.reduce((acc, { id, code }) => {
      acc[code] = id
      return acc
    }, {})

    const allStudyprogramCodes = new Set(allStudyprograms.map(({ code }) => code))

    const studyrightCodes = studyrights.data
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

  async requestDevice(email) {
    const updatedUser = await this.update({ wantsDevice: true, personalEmail: email })
    return updatedUser
  }

  async claimDevice(deviceId, deviceDistributedBy) {
    const settings = await ServiceStatus.getObject()

    const validSerial = await validateSerial(deviceId, settings)
    if (!validSerial) throw new ParameterError('Invalid deviceId')

    if (
      !(
        this.eligible
            && this.wantsDevice
            && this.digiSkillsCompleted
            && this.courseRegistrationCompleted
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
    const reclaimStatus = this.reclaimStatus ? 'CLOSED' : null

    await this.update({
      deviceReturned: true,
      deviceReturnedAt: new Date(),
      deviceReturnedBy: returnMarkedByUserid,
      reclaimStatus,
    })
  }

  async updateStatus(digiSkills, enrolled) {
    await this.update({
      digiSkillsCompleted: !!digiSkills || this.digiSkillsCompleted,
      courseRegistrationCompleted: !!enrolled || this.courseRegistrationCompleted,
    })
  }

  async updateReclaimStatus(reclaimStatus) {
    await this.update({ reclaimStatus })
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
    reclaimStatus: {
      type: DataTypes.ENUM('OPEN', 'CONTACTED', 'CLOSED'),
      field: 'reclaim_status',
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
    present: {
      type: DataTypes.BOOLEAN,
      field: 'present',
    },
    deviceReturnDeadlinePassed: {
      type: DataTypes.BOOLEAN,
      field: 'device_return_deadline_passed',
    },
    thirdYearOrLaterStudent: {
      type: DataTypes.BOOLEAN,
      field: 'third_year_or_later_student',
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
