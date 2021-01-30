module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (t) => {
    try {
      await queryInterface.createTable('reclaim_cases', {
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
        status: {
          type: Sequelize.ENUM('OPEN', 'CONTACTED', 'CLOSED'),
          allowNull: false,
        },
        absent: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        loan_expired: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        credits_under_limit: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        year: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        semester: {
          type: Sequelize.ENUM('SPRING', 'AUTUMN'),
          allowNull: false,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW'),
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW'),
        },
      }, { transaction: t })

      await queryInterface.sequelize.query(
        `INSERT INTO reclaim_cases (user_id, status, absent, loan_expired, credits_under_limit, year, semester)
         SELECT
            id,
            reclaim_status::text::enum_reclaim_cases_status,
            NOT present,
            device_return_deadline_passed,
            first_year_credits < 30,
            2020 AS year,
            'AUTUMN' AS semester
         FROM users
         WHERE reclaim_status IS NOT NULL;
        `,
        { transaction: t },
      )

      await queryInterface.removeColumn('users', 'reclaim_status', { transaction: t })
      await queryInterface.removeColumn('users', 'present', { transaction: t })
      await queryInterface.removeColumn('users', 'device_return_deadline_passed', { transaction: t })

      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }),

  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (t) => {
    try {
      await queryInterface.addColumn('users', 'reclaim_status', {
        type: Sequelize.ENUM('OPEN', 'CONTACTED', 'CLOSED'),
      }, { transaction: t })

      await queryInterface.addColumn('users', 'device_return_deadline_passed', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }, { transaction: t })

      await queryInterface.addColumn('users', 'present', {
        type: Sequelize.BOOLEAN,
      }, { transaction: t })

      await queryInterface.sequelize.query(
        `UPDATE users
         SET reclaim_status = reclaim_cases.status::text::enum_users_reclaim_status,
            device_return_deadline_passed = reclaim_cases.loan_expired,
            present = NOT reclaim_cases.absent
         FROM reclaim_cases
         WHERE users.id = reclaim_cases.user_id:
        `,
        { transaction: t },
      )

      await queryInterface.dropTable('reclaim_cases', { transaction: t })

      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }),
}
