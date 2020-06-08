module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('service_status', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    student_registration_online: {
      type: Sequelize.BOOLEAN,
    },
    current_year: {
      type: Sequelize.INTEGER,
    },
    current_semester: {
      type: Sequelize.INTEGER,
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
  down: queryInterface => queryInterface.dropTable('service_status'),
}
