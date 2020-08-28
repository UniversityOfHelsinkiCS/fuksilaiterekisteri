const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('@database')

class StudyProgram extends Model {

}

StudyProgram.init(
  {
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    contactEmail: {
      type: DataTypes.STRING,
      field: 'contact_email',
    },
    contactName: {
      type: DataTypes.STRING,
      field: 'contact_name',
    },
  },
  {
    sequelize,
    modelName: 'studyProgram',
    underscored: true,
    tableName: 'study_programs',
  },
)


module.exports = StudyProgram
