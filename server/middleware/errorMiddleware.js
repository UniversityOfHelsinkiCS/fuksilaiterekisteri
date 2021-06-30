/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
const Sentry = require('@sentry/node')
const logger = require('@util/logger')

const errorMiddleware = (req, res, next) => {
  const oldWrite = res.write
  const oldEnd = res.end

  const chunks = []

  res.write = function (chunk) {
    chunks.push(chunk)
    return oldWrite.apply(res, arguments)
  }

  res.end = function (chunk) {
    if (chunk) { chunks.push(chunk) }

    const { statusCode } = res
    if (statusCode >= 400 && req.headers.uid !== 'ohj_tosk') {
      const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
      const { originalUrl, method, query } = req
      const errorMsg = body.error || ''
      const message = `Response ${originalUrl} failed with status code ${statusCode} - ${errorMsg}`
      logger.info({
        originalUrl, body: JSON.stringify(body), method, query, message,
      })
      Sentry.withScope((scope) => {
        scope.setUser(req.user ? req.user.get({ plain: true }) : null)
        scope.setExtras({
          originalUrl, body: JSON.stringify(body), method, query,
        })
        Sentry.captureMessage(message)
      })
    }
    oldEnd.apply(res, arguments)
  }

  next()
}

module.exports = { errorMiddleware }
