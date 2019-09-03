module.exports = {
  up: async queryInterface => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.sequelize.query('ALTER TABLE user_study_programs DROP CONSTRAINT "user_study_programs_user_id_fkey"', { transaction })
    await queryInterface.sequelize.query('ALTER TABLE user_study_programs ADD CONSTRAINT "user_study_programs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE', { transaction })
  }),
  down: async () => {
  },
}
