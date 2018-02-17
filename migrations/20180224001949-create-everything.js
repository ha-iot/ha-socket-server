// noinspection JSUnusedGlobalSymbols, JSCheckFunctionSignatures
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.createTable('Board', _getBoardDefinition(Sequelize)),
    queryInterface.createTable('User', _getUserDefinition(Sequelize))
  ]).then(() => Promise.all([
    queryInterface.createTable('UserBoardPermission', _getUserBoardPermissionDefinition(Sequelize)),
    queryInterface.createTable('Action', _getActionDefinition(Sequelize)),
    queryInterface.createTable('Pin', _getPinDefinition(Sequelize))
  ])),
  down: queryInterface => Promise.all([
    queryInterface.dropTable('Pin', {}),
    queryInterface.dropTable('Action', {}),
    queryInterface.dropTable('UserBoardPermission', {})
  ]).then(() => Promise.all([
    queryInterface.dropTable('User', {}),
    queryInterface.dropTable('Board', {})
  ]))
}

function _getUUIDField (Sequelize) {
  return {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  }
}

function _getFKField (Sequelize, model) {
  return {
    allowNull: false,
    type: Sequelize.UUID,
    references: {
      model,
      key: 'id'
    }
  }
}

function _getPinDefinition (Sequelize) {
  return {
    id: _getUUIDField(Sequelize),
    label: {
      allowNull: false,
      type: Sequelize.STRING
    },
    number: {
      allowNull: false,
      type: Sequelize.STRING
    },
    isOn: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN
    },
    boardId: _getFKField(Sequelize, 'Board'),
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }
}

function _getActionDefinition (Sequelize) {
  return {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUID
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    boardId: _getFKField(Sequelize, 'Board'),
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }
}

function _getBoardDefinition (Sequelize) {
  return {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUID
    },
    model: {
      allowNull: true,
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }
}

function _getUserDefinition (Sequelize) {
  return {
    id: _getUUIDField(Sequelize),
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }
}

function _getUserBoardPermissionDefinition (Sequelize) {
  return {
    id: _getUUIDField(Sequelize),
    isMaster: {
      allowNull: false,
      defaultValue: true,
      type: Sequelize.BOOLEAN
    },
    boardId: _getFKField(Sequelize, 'Board'),
    userId: _getFKField(Sequelize, 'User'),
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }
}
