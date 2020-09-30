const { ServiceStatus, Email } = require('@models')
const { ParameterError, ForbiddenError } = require('@util/errors')
const completionChecker = require('@util/completionChecker')


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

const requestDevice = async (user, email) => {
  const settings = await ServiceStatus.getObject()

  if (!user.eligible || user.signupYear !== settings.currentYear) {
    throw new ForbiddenError('Not eligible', 403)
  }

  if (email !== null && !validateEmail(email)) {
    throw new ParameterError('Invalid email')
  }

  const readyEmail = await Email.findAutosendTemplate('AUTOSEND_WHEN_READY')
  const updatedUser = await user.update({ wantsDevice: true, personalEmail: email })

  await completionChecker(updatedUser, readyEmail)
  return updatedUser
}

const claimDevice = async (user, student, deviceId) => {
  const settings = await ServiceStatus.getObject()

  const validSerial = await validateSerial(deviceId, settings)
  if (!validSerial) throw new ParameterError('Invalid deviceId')

  if (
    !(
      student.eligible
          && student.wantsDevice
          && student.digiSkillsCompleted
          && student.courseRegistrationCompleted
          && !student.deviceGivenAt
          && student.signupYear === settings.currentYear
    )
  ) {
    throw new ForbiddenError(`Student ${student.studentNumber} not eligible for device`)
  }

  const deviceData = {
    device_distributed_by: user.userId,
    deviceSerial: deviceId.substring(settings.serialSeparatorPos),
    deviceGivenAt: new Date(),
  }

  await student.update({
    ...deviceData,
  })

  return deviceData
}

module.exports = {
  requestDevice,
  claimDevice,
}
