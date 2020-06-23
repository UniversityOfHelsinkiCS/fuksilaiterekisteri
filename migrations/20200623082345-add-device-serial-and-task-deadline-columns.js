module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.addColumn('service_status', 'task_deadline', {
      type: Sequelize.DATE,
    }, { transaction: t }),
    queryInterface.addColumn('service_status', 'device_serial', {
      type: Sequelize.STRING,
    }, { transaction: t }),
  ])),

  down: queryInterface => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.removeColumn('service_status', 'task_deadline', { transaction: t }),
    queryInterface.removeColumn('service_status', 'device_serial', { transaction: t }),
  ])),
}
