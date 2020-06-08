module.exports = {
    up(queryInterface) {
      return queryInterface.renameColumn('users', 'fresher_year', 'signup_year')
    },

    down(queryInterface) {
      return queryInterface.renameColumn('users', 'signup_year', 'fresher_year')
    },
  }
