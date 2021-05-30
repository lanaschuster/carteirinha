const Router = require('express')

const { generateJwt } = require('../infrastructure/auth/jwt')
const authMiddleware = require('../infrastructure/auth/middleware')
const blacklist = require('../../redis/blacklistController')

const InternalServerError = require('../entities/errors/InternalServerError')

const router = Router()

router.post('/login', authMiddleware.local, (req, res, next) => {
  try {
    const token = generateJwt(req.user)
    res.setHeader('Authorization', token)
    res.status(204).send()
  } catch (error) {
    throw new InternalServerError(error.message)
  }
})

router.get('/logout', authMiddleware.bearer, async (req, res, next) => {
  try {
    const token = req.token
    await blacklist.add(token)
    res.status(204).send()
  } catch (error) {
    throw new InternalServerError(error.message)
  }
})


module.exports = router
