const jwt = require('jsonwebtoken')

const generateJwt = user => {
  const payload = { id: user.id }
  return jwt.sign(payload, process.env.JWT_SECRET)
}

module.exports = { generateJwt }
