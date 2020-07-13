module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('service_status', 'serial_separator_pos', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('service_status', 'serial_separator_pos')
  },
}
