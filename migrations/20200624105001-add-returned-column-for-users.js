module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'device_returned', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('users', 'device_returned')
  },
}
