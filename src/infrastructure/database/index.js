require('dotenv').config()

const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')
const { applyAssociations } = require('./associations')

let db = {}
const basename = path.basename(module.filename)
const modelsPath = `${process.cwd()}\\src\\repositories`

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER, 
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    define: {
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
)

fs
  .readdirSync(modelsPath)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    let model = require(path.join(modelsPath, file))(Sequelize, sequelize)
    db[model.name] = model
  })


applyAssociations(sequelize)


Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
