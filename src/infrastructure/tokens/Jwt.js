const jwt = require('jsonwebtoken')
const blocklist = require('../../../redis/accessTokenBlocklist')

class Jwt {
  generate(id, [time, unit]) {
    const payload = { id }
    const options = { expiresIn: time + unit }
    return jwt.sign(payload, process.env.JWT_SECRET, options)
  }

  verify(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
  }

  async invalidate(token) {
    await blocklist.add(token)
  }
}

module.exports = Jwt
