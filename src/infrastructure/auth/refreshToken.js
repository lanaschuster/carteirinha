const refreshTokenAllowList = require('../../../redis/refreshTokenAllowList')
const InvalidArgumentError = require('../../entities/errors/InvalidArgumentError')

const crypto = require('crypto')
const moment = require('moment')


const generateOpaqueToken = async user => {
  const expiresIn = moment().add(5, 'd').unix()
  const refreshToken = crypto.randomBytes(24).toString('hex')
  await refreshTokenAllowList.add(refreshToken, user.id, expiresIn)
  return refreshToken
}

const verify = async refreshToken => {
  if (!refreshToken) {
    throw new InvalidArgumentError('refreshToken')
  }

  const id = await refreshTokenAllowList.get(refreshToken)
  if (!id) {
    throw new InvalidArgumentError('refreshToken')
  }
  
  return id
}

const invalidate = async refreshToken => {
  await refreshTokenAllowList.remove(refreshToken)
}

module.exports = { 
  generateOpaqueToken, 
  verify,
  invalidate
}
