const {getUUIDField} = require('./_common')

module.exports = (sequelize, DataTypes) => sequelize.define('Board', {
  id: getUUIDField(DataTypes),
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  model: {
    allowNull: true,
    type: DataTypes.STRING
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  freezeTableName: true
})
