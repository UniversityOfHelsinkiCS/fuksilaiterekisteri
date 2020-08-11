/* eslint-disable no-unused-vars */

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addConstraint('study_programs', {
    fields: ['code'],
    type: 'unique',
    name: 'codeUnique',
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeConstraint('study_programs', 'unique_code'),
}
