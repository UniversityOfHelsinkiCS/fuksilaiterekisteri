const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('@database')

class User extends Model {
  static a() {
    console.log('a')
  }

  b() {
    console.log(this, 'b')
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
