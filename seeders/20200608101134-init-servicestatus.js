const defaultTranslations = require('../util/defaultTranslations.json')

module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'service_status',
    [{
      student_registration_online: false,
      current_year: 2019,
      current_semester: 139,
      custom_texts: JSON.stringify(defaultTranslations),
      created_at: new Date(),
      updated_at: new Date(),
    }],
  ),

  down: queryInterface => queryInterface.bulkDelete('service_status', null, {}),
}
