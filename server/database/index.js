const Sequelize = require('sequelize')

const env = process.env.NODE_ENV || 'development'
const config = require('@root/config/config.js')[env]


let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, config)
}

module.exports = {
  sequelize,
  Sequelize,
}
