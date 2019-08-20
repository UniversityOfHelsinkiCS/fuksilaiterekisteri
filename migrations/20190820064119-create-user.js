module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.STRING,
    },
    student_number: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    hy_email: {
      type: Sequelize.STRING,
    },
    personal_email: {
      type: Sequelize.STRING,
    },
    admin: {
      type: Sequelize.BOOLEAN,
    },
    distributor: {
      type: Sequelize.BOOLEAN,
    },
    staff: {
      type: Sequelize.BOOLEAN,
    },
    date_of_birth: {
      type: Sequelize.STRING,
    },
    device_serial: {
      type: Sequelize.STRING,
    },
    device_given_at: {
      type: Sequelize.DATE,
    },
    eligible: {
      type: Sequelize.BOOLEAN,
    },
    wants_device: {
      type: Sequelize.BOOLEAN,
    },
    digi_skills_completed: {
      type: Sequelize.BOOLEAN,
    },
    course_registration_completed: {
      type: Sequelize.BOOLEAN,
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
  down: queryInterface => queryInterface.dropTable('users'),
}
