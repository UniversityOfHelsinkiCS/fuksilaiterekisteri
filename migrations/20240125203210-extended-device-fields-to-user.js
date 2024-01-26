

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.addColumn('users', 'extended_wants_device', {
      type: Sequelize.BOOLEAN,
    }, { transaction: t }),
    queryInterface.addColumn('users', 'extended_eligible', {
      type: Sequelize.BOOLEAN,
    }, { transaction: t }),
  ])),

  down: queryInterface => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.removeColumn('users', 'extended_wants_device', { transaction: t }),
    queryInterface.removeColumn('users', 'extended_eligible', { transaction: t }),
  ])),
}
