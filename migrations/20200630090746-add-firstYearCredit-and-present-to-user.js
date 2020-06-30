module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.addColumn('users', 'first_year_credits', {
      type: Sequelize.INTEGER,
    }, { transaction: t }),
    queryInterface.addColumn('users', 'present', {
      type: Sequelize.BOOLEAN,
    }, { transaction: t }),
  ])),

  down: queryInterface => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.removeColumn('users', 'first_year_credits', { transaction: t }),
    queryInterface.removeColumn('users', 'present', { transaction: t }),
  ])),
}
