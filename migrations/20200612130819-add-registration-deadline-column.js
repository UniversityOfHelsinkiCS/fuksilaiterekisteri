module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('service_status', 'registration_deadline', {
      type: Sequelize.DATE,
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('service_status', 'registration_deadline')
  },
}
