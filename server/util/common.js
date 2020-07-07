const common = require('@root/util/common')

module.exports = {
  ...common,
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT || 8000,
  STUDENT_API_URL: process.env.STUDENT_API_URL,
  STUDENT_API_TOKEN: process.env.STUDENT_API_TOKEN,
  DIGI_COURSES: [
    'DIGI-A',
  ],
}
