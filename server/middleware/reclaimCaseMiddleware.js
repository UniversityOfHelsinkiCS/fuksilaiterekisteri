const { ParameterError, NotFoundError } = require('@util/errors')
const { ReclaimCase } = require('@models')

const checkReclaimCase = async (req, _res, next) => {
  const { reclaimCaseId } = req.params
  if (!reclaimCaseId) throw new ParameterError('Reclaim case id required')

  const reclaimCase = await ReclaimCase.findCase(reclaimCaseId)
  if (!reclaimCase) throw new NotFoundError('Reclaim case not found')

  req.reclaimCase = reclaimCase
  next()
}

module.exports = {
  checkReclaimCase,
}
