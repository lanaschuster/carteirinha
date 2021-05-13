module.exports = (Sequelize, sequelize) => {
  return sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
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
    avatar: {
      type: Sequelize.STRING
    }
  }, {
    tableName: 'users',
    freezeTableName: true,
    version: 'version',
    createdAt: 'createdAt',
    updateAt: 'updateAt'
  })
}
