const Umzug = require('umzug')
const logger = require('@util/logger')
const { inProduction } = require('@util/common')
const { sequelize, Sequelize } = require('@database')
const models = require('../models')

const DB_CONNECTION_RETRY_LIMIT = 60

const runMigrations = async () => {
  const migrator = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
    },
    logging: msg => logger.info(msg),
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize],
      path: `${process.cwd()}/migrations`,
      pattern: /\.js$/,
    },
  })
  return migrator.up()
}

const runSeeders = async () => {
  const migrator = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
    },
    logging: msg => logger.info(msg),
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize],
      path: `${process.cwd()}/seeders`,
      pattern: /\.js$/,
    },
  })
  return migrator.up()
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const initializeDatabaseConnection = async (attempt = 1) => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    if (!inProduction) await runSeeders()
    console.log('Initialized connection to database')
    return true
  } catch (e) {
    if (attempt === DB_CONNECTION_RETRY_LIMIT) {
      logger.error(`Connection to database failed after ${attempt} attempts`)
      process.exit(1)
    }
    logger.error(
      `Connection to database failed! Attempt ${attempt} of ${DB_CONNECTION_RETRY_LIMIT}`,
    )
    await sleep(1000)
    return initializeDatabaseConnection(attempt + 1)
  }
}

module.exports = { initializeDatabaseConnection }
