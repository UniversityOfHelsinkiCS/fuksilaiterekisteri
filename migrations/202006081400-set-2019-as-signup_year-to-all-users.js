module.exports = {
  up: queryInterface => queryInterface.bulkUpdate(
    'users', { signup_year: 2019 }, { signup_year: null },
  ),
  down: queryInterface => queryInterface.bulkUpdate(
    'users', { signup_year: null }, { signup_year: 2019 },
  ),
}
