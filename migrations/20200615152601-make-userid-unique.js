/* eslint-disable no-unused-vars */

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addConstraint('users', ['user_id'], {
    type: 'unique',
    name: 'uidUnique',
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeConstraint('users', 'uidUnique'),
}
