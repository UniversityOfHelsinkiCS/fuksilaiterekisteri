module.exports = (sequelize, DataTypes) => {
  const serviceStatus = sequelize.define(
    'servicestatus',
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
    },
    {
      underscored: true,
      tableName: 'service_status',
    }
  )
  return serviceStatus
}
