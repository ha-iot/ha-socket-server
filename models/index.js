const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  operatorsAliases: Sequelize.Op
})

const db = fs
  .readdirSync(__dirname)
  .filter(file => !file.startsWith('_') && file !== basename && file.endsWith('.js'))
  .reduce((db, file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
    return db
  }, {})

Object.values(db).forEach(model => {
  model.sync()
  if (model.associate) {
    model.associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
