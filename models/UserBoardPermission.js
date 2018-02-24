const {getUUIDField} = require('./_common')

module.exports = (sequelize, DataTypes) => {
  const UserBoardPermission = sequelize.define('UserBoardPermission', {
    id: getUUIDField(DataTypes),
    isActive: {
      allowNull: false,
      defaultValue: true,
      type: DataTypes.BOOLEAN
    },
    isMaster: {
      allowNull: false,
      defaultValue: true,
      type: DataTypes.BOOLEAN
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

  UserBoardPermission.associate = ({User, Board}) => {
    UserBoardPermission.belongsTo(User, {foreignKey: 'userId'})
    UserBoardPermission.belongsTo(Board, {foreignKey: 'userId'})
  }

  return UserBoardPermission
}
