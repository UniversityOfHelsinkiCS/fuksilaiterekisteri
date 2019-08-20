const { sequelize, Sequelize } = require('@root/models')
const Umzug = require('umzug')

const DB_CONNECTION_RETRY_LIMIT = 60

const runMigrations = async () => {
  const migrator = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
    },
    logging: console.log,
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize],
      path: `${process.cwd()}/migrations`,
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
    return true
  } catch (e) {
    if (attempt === DB_CONNECTION_RETRY_LIMIT) {
      console.log(`Connection to database failed after ${attempt} attempts`)
      process.exit(1)
    }
    console.log(`Connection to database failed! Attempt ${attempt} of ${DB_CONNECTION_RETRY_LIMIT}`)
    await sleep(1000)
    return initializeDatabaseConnection(attempt + 1)
  }
}

module.exports = { initializeDatabaseConnection }
