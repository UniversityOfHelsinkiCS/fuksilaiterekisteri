
const defaultTranslations = require('../util/defaultTranslations.json')

module.exports = {

  up: (queryInterface, Sequelize) => queryInterface.changeColumn('service_status', 'custom_texts', {
    type: Sequelize.JSONB,
    defaultValue: null,
    allowNull: true,
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn('service_status', 'custom_texts', {
    type: Sequelize.JSONB,
    allowNull: false,
    defaultValue: defaultTranslations,
  }),
}
