module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'reclaimer', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('users', 'reclaimer')
  },
}
