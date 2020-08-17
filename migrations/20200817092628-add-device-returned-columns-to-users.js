

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.addColumn('users', 'device_returned_at', {
      type: Sequelize.DATE,
    }, { transaction: t }),
    queryInterface.addColumn('users', 'device_returned_by', {
      type: Sequelize.STRING,
    }, { transaction: t }),
  ])),

  down: queryInterface => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.removeColumn('users', 'device_returned_at', { transaction: t }),
    queryInterface.removeColumn('users', 'device_returned_by', { transaction: t }),
  ])),
}
