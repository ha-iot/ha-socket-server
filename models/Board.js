const {getUUIDField} = require('./_common')

module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define('Board', {
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

  Board.associate = ({Pin, Action, UserBoardPermission}) => {
    Board.hasMany(Pin, {foreignKey: 'boardId'})
    Board.hasMany(Action, {foreignKey: 'boardId'})
    Board.hasMany(UserBoardPermission, {foreignKey: 'boardId'})
  }

  return Board
}
