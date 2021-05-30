const jwt = require('jsonwebtoken')
const { createHash } = require('crypto')
const blacklist = require('./blacklist')


const { promisify } = require('util')
const existsAsync = promisify(blacklist.exists).bind(blacklist)
const setAsync = promisify(blacklist.set).bind(blacklist)

function hashToken(token) {
  return createHash('sha256')
    .update(token)
    .digest('hex')
}

module.exports = {
  add: async token => {
    const ts = jwt.decode(token).exp
    const hash = hashToken(token)
    
    await setAsync(hash, '')
    blacklist.expireat(hash, ts)
  },
  hasToken: async token => {
    const hash = hashToken(token)
    const result = await existsAsync(hash)
    return result === 1
  }
}