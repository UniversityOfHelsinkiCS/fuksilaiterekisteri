module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'eligibility_reasons', {
      type: Sequelize.JSONB,
      defaultValue: {},
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('users', 'eligibility_reasons')
  },
}
