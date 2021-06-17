const refreshTokenAllowList = require('../../../redis/refreshTokenAllowList')
const InvalidArgumentError = require('../../entities/errors/InvalidArgumentError')

const crypto = require('crypto')
const moment = require('moment')

class RefreshToken {
  async generate(id, [time, unit]) {
    const expiresIn = moment().add(time, unit).unix()
    const refreshToken = crypto.randomBytes(24).toString('hex')
    await refreshTokenAllowList.add(refreshToken, id, expiresIn)
    return refreshToken
  }

  async verify(token) {
    if (!token) {
      throw new InvalidArgumentError('refreshToken is invalid')
    }
  
    const id = await refreshTokenAllowList.get(token)
    if (!id) {
      throw new InvalidArgumentError('refreshToken is invalid')
    }
    
    return id
  }

  async invalidate(token) {
    await refreshTokenAllowList.remove(token)
  }
}

module.exports = RefreshToken
