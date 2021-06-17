const Jwt = require('./Jwt')
const RefreshToken = require('./RefreshToken')
const InternalServerError = require('../../entities/errors/InternalServerError')

class TokenFactory {
  create(type) {
    if (type === 'JWT') {
      return new Jwt()
    } else if (type === 'REFRESH') {
      return new RefreshToken()
    } else {
      throw new InternalServerError(`Unknown token type: ${type}`)
    }
  }
}

module.exports = new TokenFactory()
