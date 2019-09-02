const validationMiddleware = (requiredParams, requiredBody) => async (req, res, next) => {
  const missingParam = requiredParams.find(p => req.params[p] === undefined)
  if (missingParam) return res.status(400).json({ error: `Param ${missingParam} missing` })

  const missingBody = requiredBody.find(p => req.body[p] === undefined)
  if (missingBody) return res.status(400).json({ error: `Body param ${missingBody} missing` })

  return next()
}

module.exports = {
  validationMiddleware,
}
