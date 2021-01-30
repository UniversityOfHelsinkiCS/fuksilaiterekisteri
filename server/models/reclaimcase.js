const { Model, DataTypes, Op } = require('sequelize')
const { sequelize } = require('@database')
const User = require('./user')


class ReclaimCase extends Model {
  static findCase(id) {
    return this.findOne({ where: { id } })
  }

  static findCases(caseIds) {
    return this.findAll({ where: { id: caseIds } })
  }

  static updateContactedCases(caseIds) {
    this.update(
      { status: 'CONTACTED' },
      {
        where: {
          id: caseIds,
          status: { [Op.ne]: 'CLOSED' },
        },
      },
    )
  }

  static updateForDeviceReturn(userId) {
    this.update({ status: 'CLOSED' }, { where: { userId } })
  }

  async updateStatus(status) {
    await this.update({ status })
  }
}

ReclaimCase.init({
  id: {
    type: DataTypes.INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
  },
  status: {
    type: DataTypes.ENUM('OPEN', 'CONTACTED', 'CLOSED'),
    field: 'status',
  },
  absent: {
    type: DataTypes.BOOLEAN,
    field: 'absent',
  },
  loanExpired: {
    type: DataTypes.BOOLEAN,
    field: 'loan_expired',
  },
  creditsUnderLimit: {
    type: DataTypes.BOOLEAN,
    field: 'credits_under_limit',
  },
  year: {
    type: DataTypes.INTEGER,
    field: 'year',
  },
  semester: {
    type: DataTypes.ENUM('SPRING', 'AUTUMN'),
    field: 'semester',
  },
}, {
  sequelize,
  modelName: 'reclaim_case',
  underscored: true,
  tableName: 'reclaim_cases',
  defaultScope: {
    attributes: ['id', 'status', 'absent', 'loanExpired', 'creditsUnderLimit', 'year', 'semester'],
    include: [{
      model: User,
      as: 'student',
      attributes: ['userId', 'studentNumber', 'name', 'hyEmail', 'personalEmail', 'deviceGivenAt', 'firstYearCredits'],
    }],
  },
})

module.exports = ReclaimCase
