const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('@database')

class UserStudyProgram extends Model {

}

UserStudyProgram.init({
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
  },
  studyProgramId: {
    type: DataTypes.INTEGER,
    field: 'study_program_id',
  },
},
{
  sequelize,
  modelName: 'userStudyProgram',
  underscored: true,
  tableName: 'user_study_programs',
})

module.exports = UserStudyProgram
