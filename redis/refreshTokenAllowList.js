const redis = require('redis')
const listCommands = require('./listCommands')
const allowList = redis.createClient({ prefix: 'allowlist-refresh-token:' })

module.exports = listCommands(allowList)
