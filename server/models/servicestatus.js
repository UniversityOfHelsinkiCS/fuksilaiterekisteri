const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('@database')

class ServiceStatus extends Model {
  static async getObject() {
    const serviceStatus = await ServiceStatus.findAll({
      limit: 1,
      order: [['updatedAt', 'DESC']],
    })

    console.log('Got service status')

    if (!serviceStatus[0]) return undefined

    return serviceStatus[0]
  }
}


ServiceStatus.init(
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
    taskDeadline: {
      type: DataTypes.DATE,
      field: 'task_deadline',
    },
    deviceSerial: {
      type: DataTypes.STRING,
      field: 'device_serial',
    },
    serialSeparatorPos: {
      type: DataTypes.INTEGER,
      field: 'serial_separator_pos',
    },
  },
  {
    sequelize,
    modelName: 'serviceStatus',
    underscored: true,
    tableName: 'service_status',
  },
)

module.exports = ServiceStatus
