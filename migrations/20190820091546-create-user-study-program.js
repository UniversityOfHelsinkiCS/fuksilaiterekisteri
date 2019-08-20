module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('user_study_programs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
    study_program_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'study_programs',
        key: 'id',
      },
      allowNull: false,
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
  down: queryInterface => queryInterface.dropTable('user_study_programs'),
}
