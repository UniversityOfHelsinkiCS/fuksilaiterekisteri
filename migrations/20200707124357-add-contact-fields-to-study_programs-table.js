module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.addColumn('study_programs', 'contact_email', {
      type: Sequelize.STRING,
    }, { transaction: t }),
    queryInterface.addColumn('study_programs', 'contact_name', {
      type: Sequelize.STRING,
    }, { transaction: t }),
  ])),

  down: queryInterface => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.removeColumn('study_programs', 'contact_email', { transaction: t }),
    queryInterface.removeColumn('study_programs', 'contact_name', { transaction: t }),
  ])),
}
