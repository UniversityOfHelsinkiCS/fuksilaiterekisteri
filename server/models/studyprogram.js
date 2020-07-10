module.exports = (sequelize, DataTypes) => {
  const studyProgram = sequelize.define(
    'studyProgram',
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
      underscored: true,
      tableName: 'study_programs',
    },
  )
  studyProgram.associate = (models) => {
    studyProgram.belongsToMany(models.user, {
      through: 'user_study_programs',
    })
  }
  return studyProgram
}
