module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('emails', 'reply_to', {
      type: Sequelize.STRING,
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('emails', 'reply_to')
  },
}
