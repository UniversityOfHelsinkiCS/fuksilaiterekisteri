const ServiceStatus = require('./servicestatus')
const StudyProgram = require('./studyprogram')
const User = require('./user')
const UserStudyProgram = require('./userstudyprogram')
const Email = require('./email')

/**
 * Define Model associations here:
 */

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
}
