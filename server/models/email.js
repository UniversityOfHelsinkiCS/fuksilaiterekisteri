const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('@database')


class Email extends Model {

}

Email.init({
  description: {
    type: DataTypes.STRING,
    field: 'description',
  },
  subject: {
    type: DataTypes.STRING,
    field: 'subject',
  },
  body: {
    type: DataTypes.STRING,
    field: 'body',
  },
  replyTo: {
    type: DataTypes.STRING,
    field: 'reply_to',
  },
  type: {
    type: DataTypes.ENUM('AUTOSEND_WHEN_READY', 'AUTOSEND_WHEN_OVERDUE', 'ADMIN', 'RECLAIM'),
    field: 'type',
  },
}, {
  sequelize,
  modelName: 'email',
  underscored: true,
  tableName: 'emails',
})

module.exports = Email
