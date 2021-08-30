/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
// eslint-disable no-unused-vars

const errorMiddleware = (req, res, next) => {
  // const { originalUrl, method, query } = req
  // const { statusCode } = res


  // if (statusCode >= 400 && req.headers.uid !== 'ohj_tosk') {
  //   logger.info({
  //     originalUrl, method, query, message: `${originalUrl} failed with status ${statusCode}`,
  //   })
  //   Sentry.withScope((scope) => {
  //     scope.setUser(req.user ? req.user.get({ plain: true }) : null)
  //     scope.setExtras({
  //       originalUrl, method, query,
  //     })
  //     Sentry.captureMessage(`${originalUrl} failed with status ${statusCode}`)
  //   })
  // }

  next()
}

module.exports = { errorMiddleware }
