module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'reclaim_status', {
      type: Sequelize.ENUM('OPEN', 'CONTACTED', 'CLOSED'),
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('users', 'reclaim_status')
  },
}
