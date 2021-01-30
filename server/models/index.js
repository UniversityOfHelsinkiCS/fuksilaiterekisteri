const ServiceStatus = require('./servicestatus')
const StudyProgram = require('./studyprogram')
const User = require('./user')
const UserStudyProgram = require('./userstudyprogram')
const Email = require('./email')
const ReclaimCase = require('./reclaimcase')

/**
 * Define Model associations here:
 */

ReclaimCase.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'student' })
User.hasMany(ReclaimCase, { foreignKey: 'userId', sourceKey: 'id' })

User.belongsToMany(StudyProgram, {
  through: 'user_study_programs',
})
StudyProgram.belongsToMany(User, {
  through: 'user_study_programs',
})

module.exports = {
  StudyProgram,
  User,
  ServiceStatus,
  UserStudyProgram,
  Email,
  ReclaimCase,
}
