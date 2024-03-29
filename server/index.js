const express = require('express')
require('express-async-errors')
const { PORT, inProduction } = require('@util/common')
const { ApplicationError } = require('@util/errors')
const routes = require('@util/routes')
const logger = require('@util/logger')
const path = require('path')
const { startCron } = require('@util/cron')
const { initializeDatabaseConnection } = require('@database/connection')
const Sentry = require('@sentry/node')
const { errorMiddleware } = require('@middleware/errorMiddleware')

initializeDatabaseConnection()
  .then(() => {
    const app = express()
    Sentry.init({
      dsn: process.env.SENTRY_ADDR,
      environment: process.env.NODE_ENV,
      release: process.env.SENTRY_RELEASE,
    })
    app.use(Sentry.Handlers.requestHandler())
    app.use(errorMiddleware)

    app.use(express.json())

    app.use('/api', routes)

    app.use((error, req, res, next) => {
      const normalizedError = error instanceof ApplicationError ? error : new ApplicationError(error.message || 'Something went wrong')
      logger.error(error.message)
      res.status(normalizedError.status).json(normalizedError)
      next(error)
    })

    /**
     * Use hot loading when in development, else serve the static content
     */
    if (!inProduction) {
      /* eslint-disable */
      console.time(1)
      console.timeLog(1, 1)
      const webpack = require('webpack')
      console.timeLog(1, 2)
      const middleware = require('webpack-dev-middleware')
      const hotMiddleWare = require('webpack-hot-middleware')
      const webpackConf = require('@root/webpack.config')
      /* eslint-enable */
      const compiler = webpack(webpackConf('development', { mode: 'development' }))
      const devMiddleware = middleware(compiler)

      app.use(devMiddleware)
      app.use(hotMiddleWare(compiler))
      app.use('*', (req, res, next) => {
        const filename = path.join(compiler.outputPath, 'index.html')
        devMiddleware.waitUntilValid(() => {
          compiler.outputFileSystem.readFile(filename, (err, result) => {
            if (err) return next(err)
            res.set('content-type', 'text/html')
            res.send(result)
            return res.end()
          })
        })
      })
    } else {
      const DIST_PATH = path.resolve(__dirname, '../dist')
      const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')

      app.use(express.static(DIST_PATH))
      app.get('*', (req, res) => res.sendFile(INDEX_PATH))
      app.use(Sentry.Handlers.errorHandler())
      startCron()
    }

    app.listen(PORT, () => {
      logger.info(`Started on port ${PORT}`)
    })
  })
  .catch((e) => {
    process.exitCode = 1
    logger.error(e)
  })
