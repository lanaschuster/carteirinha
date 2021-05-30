const jwt = require('jsonwebtoken')

const generateJwt = user => {
  const payload = { id: user.id }
  const options = { expiresIn: '1h' }
  return jwt.sign(payload, process.env.JWT_SECRET, options)
}

module.exports = { generateJwt }
