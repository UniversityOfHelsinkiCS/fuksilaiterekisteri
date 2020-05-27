module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('emails', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    description: {
      type: Sequelize.STRING,
    },
    subject: {
      type: Sequelize.STRING,
    },
    body: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.ENUM('AUTOSEND_WHEN_READY', 'AUTOSEND_WHEN_OVERDUE', 'ADMIN', 'RECLAIM'),
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('emails'),
}
