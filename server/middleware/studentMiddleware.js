const { ParameterError, NotFoundError } = require('@util/errors')
const { User } = require('@models')

const checkStudent = async (req, _res, next) => {
  const { studentNumber } = req.params
  if (!studentNumber) throw new ParameterError('Studentnumber required')

  const student = await User.findStudent(studentNumber)

  if (!student) throw new NotFoundError('student not found')

  req.student = student
  next()
}

module.exports = {
  checkStudent,
}
