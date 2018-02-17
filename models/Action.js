const {getUUIDField} = require('./_common')

module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('Action', {
    id: getUUIDField(DataTypes),
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
    freezeTableName: true,
    classMethods: {
      associate: _associate
    }
  })
  return Action

  function _associate (models) {
    Action.belongsTo(models['Board'])
  }
}
