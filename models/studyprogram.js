module.exports = (sequelize, DataTypes) => {
  const studyProgram = sequelize.define(
    'studyProgram',
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
    },
    {
      underscored: true,
      tableName: 'study_programs',
    },
  )
  studyProgram.associate = (models) => {
    studyProgram.belongsToMany(models.user, {
      through: 'user_study_programs',
      as: 'users',
    })
  }
  return studyProgram
}
