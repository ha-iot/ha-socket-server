module.exports = {
  up: ({createTable}, Sequelize) => createTable('UserBoardPermission', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    isMaster: {
      allowNull: false,
      defaultValue: true,
      type: Sequelize.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: ({dropTable}) => dropTable('UserBoardPermission')
}
