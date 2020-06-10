module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('emails', 'body', {
      type: Sequelize.STRING(15000),
    })
  },

  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('emails', 'body', {
      type: Sequelize.STRING,
    })
  },
}
