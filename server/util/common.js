const common = require('@root/util/common')

const isSuperAdmin = (userId) => {
  if (userId === 'admin' && !common.inProduction) return true
  if (process.env.SUPERADMINS && process.env.SUPERADMINS.split(',').find(u => u === userId)) return true
  return false
}

module.exports = {
  ...common,
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT || 8000,
  STUDENT_API_URL: process.env.STUDENT_API_URL,
  SIS: process.env.SIS === 'true',
  STUDENT_API_TOKEN: process.env.STUDENT_API_TOKEN,
  DIGI_COURSES: [
    'DIGI-000A',
    'DIGI-100A',
    'DIGI-200A',
    'DIGI-300A',
    'DIGI-400A',
    'AYDIGI-500A',
    'DIGI-A',
  ],
  isSuperAdmin,
}
