const refreshTokenAllowList = require('../../../redis/refreshTokenAllowList')

const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const moment = require('moment')

const generateJwt = user => {
  const payload = { id: user.id }
  const options = { expiresIn: '1h' }
  return jwt.sign(payload, process.env.JWT_SECRET, options)
}

const generateOpaqueToken = async user => {
  const expiresIn = moment().add(5, 'd').unix()
  const refreshToken = crypto.randomBytes(24).toString('hex')
  await refreshTokenAllowList.add(refreshToken, user.id, expiresIn)
  return refreshToken
}

module.exports = { generateJwt, generateOpaqueToken }
