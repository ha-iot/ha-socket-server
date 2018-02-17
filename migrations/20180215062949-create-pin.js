module.exports = {
  up: ({createTable}, Sequelize) => createTable('Pin', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    number: {
      allowNull: false,
      type: Sequelize.STRING
    },
    isOn: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN
    }
  }),
  down: ({dropTable}) => dropTable('Pin')
}
