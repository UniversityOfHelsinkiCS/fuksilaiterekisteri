module.exports = (sequelize, DataTypes) => {
  const userStudyProgram = sequelize.define(
    'userStudyProgram',
    {
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
      underscored: true,
      tableName: 'user_study_programs',
    },
  )
  return userStudyProgram
}
