const Router = require('express')

const authMiddleware = require('../infrastructure/auth/middleware')
const { generateJwt } = require('../infrastructure/auth/jwt')

const router = Router()

router.post('/login', authMiddleware.local, (req, res, next) => {
  const token = generateJwt(req.user)
  res.setHeader('Authorization', token)
  res.status(204).send()
})

module.exports = router
