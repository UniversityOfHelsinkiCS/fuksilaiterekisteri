module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'third_year_or_later_student', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('users', 'third_year_or_later_student')
  },
}
