const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('@database')
const ServiceStatus = require('./servicestatus')
const StudyProgram = require('./studyprogram')
const {
  userApi, getMinMaxSemesters,
} = require('./lib/userApi')

const mock = require('../services/mock')
const { DIGI_COURSES, inProduction } = require('../util/common')

class User extends Model {
  async getStudyRights() {
    if (!inProduction) return Promise.resolve(mock.findStudyrights(this.studentNumber))
    const res = await userApi.get(`/students/${this.studentNumber}/studyrights`)
    return res.data
  }

  async hasDigiSkills() {
    return (await Promise.all(DIGI_COURSES.map(code => (
      userApi.get(`/students/${this.studentNumber}/courses/${code}`)
    )))).map(res => res.data).includes(true)
  }

  async getStudytrackEnrollmentStatus(studytrackId) {
    const res = await userApi.get(`/students/${this.studentNumber}/enrolled/${studytrackId}`)
    return res.data
  }

  async getSemesterEnrollments() {
    if (!inProduction) return Promise.resolve(mock.findSemesterEnrollments(this.studentNumber))
    const res = await userApi.get(`/students/${this.studentNumber}/semesterEnrollments`)
    return res.data
  }

  async getYearsCredits(startingSemester) {
    if (!inProduction) return Promise.resolve(mock.findFirstYearCredits(this.studentNumber))
    const res = await userApi.get(`/students/${this.studentNumber}/fuksiYearCredits/${startingSemester}`)
    return res.data
  }

  async isEligible(at) {
    const settings = await ServiceStatus.getObject()
    const studyrights = await this.getStudyRights()
    const semesterEnrollments = await this.getSemesterEnrollments()
    const acceptableStudyProgramCodes = (await StudyProgram.findAll({ attributes: ['code'] })).map(({ code }) => code)

    const mlu = studyrights.data.find(({ faculty_code }) => faculty_code === 'H50')
    const { min, max } = inProduction ? await getMinMaxSemesters() : {
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

    if (!inProduction) {
      console.log('hasPreviousStudyright            \t', hasPreviousStudyright)
      console.log('hasNewStudyright                 \t', hasNewStudyright)
      console.log('isPresent                        \t', isPresent)
      console.log('didRegisterBeforeEndingTime      \t', didRegisterBeforeEndingTime)
      console.log('hasValidBachelorsStudyright      \t', hasValidBachelorsStudyright)
    }

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
