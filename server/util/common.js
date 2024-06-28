const common = require('@root/util/common')

const isSuperAdmin = (userId) => {
  if (userId === 'admin' && !common.inProduction) return true
  console.log(`userId: ${userId} superAdmins: ${process.env.SUPERADMINS}`)
  if (process.env.SUPERADMINS && process.env.SUPERADMINS.split(',').find(u => u === userId)) return true
  console.log(`userId: ${userId} not super admin`)
  return false
}

const validateEmail = (checkEmail) => {
  const validationRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  // Returns true if valid
  return validationRegex.test(checkEmail) && !checkEmail.includes('helsinki.') && !checkEmail.includes('@cs.')
}

const validateSerial = async (serial, settings) => {
  const FULL_SERIAL_LENGTH = settings.deviceSerial.length
  const STATIC_SERIAL_PART = settings.deviceSerial.substring(0, settings.serialSeparatorPos)
  if (serial.length === FULL_SERIAL_LENGTH && (serial.substr(0, settings.serialSeparatorPos) === STATIC_SERIAL_PART)) return true
  return false
}

const useMock = !process.env.NO_API_MOCK

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
  validateEmail,
  validateSerial,
  useMock,
}
