const app = require('./app')
const db = require('./infrastructure/database/setup')
require('../redis/accessTokenBlocklist')
require('../redis/refreshTokenAllowList')

const PORT = process.env.PORT || 9000

db.sequelize.authenticate()
  .then(r => {
    app.listen(PORT, () => {
      console.log(`carteirinha is listening on port ${PORT}`)
    })
  }).catch(err => {
    console.log(err)
  })
