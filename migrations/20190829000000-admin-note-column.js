module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'admin_note',
      Sequelize.STRING,
    )
  },

  down(queryInterface) {
    return queryInterface.removeColumn(
      'users',
      'admin_note',
    )
  },
}
