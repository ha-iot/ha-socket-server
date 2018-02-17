module.exports = {
  getUUIDField: ({UUID, UUIDV4}) => ({
    type: UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4
  })
}
