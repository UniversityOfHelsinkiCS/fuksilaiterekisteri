module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('service_status', 'custom_texts', {
      type: Sequelize.JSONB,
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('service_status', 'custom_texts')
  },
}
