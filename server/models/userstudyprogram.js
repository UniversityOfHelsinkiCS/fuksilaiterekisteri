module.exports = (sequelize, DataTypes) => {
  const userStudyProgram = sequelize.define(
    'userStudyProgram',
    {
      user_id: DataTypes.INTEGER,
      study_program_id: DataTypes.INTEGER,
    },
    {
      underscored: true,
      tableName: 'user_study_programs',
    },
  )
  return userStudyProgram
}
