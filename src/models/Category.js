module.exports = (Sequelize, sequelize) => {
  return sequelize.define('category', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    tableName: 'categories',
    freezeTableName: true,
    version: 'version',
    createdAt: 'createdAt',
    updateAt: 'updateAt'
  })
}
