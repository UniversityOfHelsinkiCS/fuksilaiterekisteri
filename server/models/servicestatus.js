module.exports = (sequelize, DataTypes) => {
  const serviceStatus = sequelize.define(
    'serviceStatus',
    {
      studentRegistrationOnline: {
        type: DataTypes.BOOLEAN,
        field: 'student_registration_online',
      },
      currentYear: {
        type: DataTypes.INTEGER,
        field: 'current_year',
      },
      currentSemester: {
        type: DataTypes.INTEGER,
        field: 'current_semester',
      },
      registrationDeadline: {
        type: DataTypes.DATE,
        field: 'registration_deadline',
      },
      customTexts: {
        type: DataTypes.JSONB,
        field: 'custom_texts',
      },
    },
    {
      underscored: true,
      tableName: 'service_status',
    },
  )
  return serviceStatus
}
