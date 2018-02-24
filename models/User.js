const {getUUIDField} = require('./_common')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: getUUIDField(DataTypes),
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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

  User.associate = ({UserBoardPermission}) => {
    User.hasMany(UserBoardPermission, {foreignKey: 'userId'})
  }

  return User
}
