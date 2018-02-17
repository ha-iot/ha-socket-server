require('dotenv').config({silent: true})

const Sequelize = require('sequelize')

const config = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op
}

module.exports = {
  development: config,
  test: config,
  production: config
}
