const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('@database')


class Email extends Model {
  static async findAutosendTemplate(type) {
    return this.findOne(({ where: { type } }))
  }

  static async updateOrCreateAutosendTemplate(newTemplate) {
    let template = await this.findOne({ where: { type: newTemplate.type } })

    if (template) await template.update({ ...newTemplate })
    else {
      template = await this.create({ ...newTemplate })
    }

    return template
  }

  static async findAdminTemplates() {
    return this.findAll(({ where: { type: 'ADMIN' } }))
  }

  static async findReclaimerTemplates() {
    return this.findAll(({ where: { type: 'RECLAIM' } }))
  }

  static async deleteTemplate(id) {
    return this.destroy(({ where: { id }, limit: 1 }))
  }
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
