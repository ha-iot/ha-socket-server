const {getUUIDField} = require('./_common')

module.exports = (sequelize, DataTypes) => {
  const Pin = sequelize.define('Pin', {
    id: getUUIDField(DataTypes),
    label: {
      allowNull: false,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    number: {
      allowNull: false,
      type: DataTypes.STRING
    },
    isOn: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate: _associate
    }
  })
  return Pin

  function _associate (models) {
    Pin.belongsTo(models['Board'])
  }
}
