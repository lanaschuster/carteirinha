const jwt = require('jsonwebtoken')
const { createHash } = require('crypto')
const redis = require('redis')

const blocklist = redis.createClient({ prefix: 'blocklist-access-token:' })
const listCommands = require('./listCommands')
const blocklistCommands = listCommands(blocklist)

function hashToken(token) {
  return createHash('sha256')
    .update(token)
    .digest('hex')
}

module.exports = {
  async add(token) {
    const ts = jwt.decode(token).exp
    const hash = hashToken(token)
    
    await blocklistCommands.add(hash, '', ts)
  },
  hasToken(token) {
    const hash = hashToken(token)
    return blocklistCommands.hasKey(hash)
  },
  async checkToken(token) {
    const blocklistToken = await this.hasToken(token)
    if (blocklistToken) {
      throw new jwt.JsonWebTokenError('token invalid by logout')
    }
  }
}
