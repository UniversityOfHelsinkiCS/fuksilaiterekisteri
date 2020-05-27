module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'fresher_year', Sequelize.INTEGER)
  },

  down(queryInterface) {
    return queryInterface.removeColumn('users', 'fresher_year')
  },
}
