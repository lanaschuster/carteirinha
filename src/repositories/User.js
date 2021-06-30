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
    isEmailVerified: {
      type: Sequelize.INTEGER
    },
    avatar: {
      type: Sequelize.STRING
    },
    isActive: {
      type: Sequelize.INTEGER
    },
  }, {
    tableName: 'user.users',
    freezeTableName: true,
    version: 'version',
    createdAt: 'createdAt',
    updateAt: 'updatedAt'
  })
}
