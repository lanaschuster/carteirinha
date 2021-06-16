const Router = require('express')
const authMiddleware = require('../infrastructure/auth/middleware')
const blacklist = require('../../redis/blacklistController')

const InternalServerError = require('../entities/errors/InternalServerError')

const { 
  generateJwt, 
  generateOpaqueToken 
} = require('../infrastructure/auth/jwt')

const router = Router()

router.post('/login', authMiddleware.local, async (req, res, next) => {
  try {
    const accessToken = generateJwt(req.user)
    const refreshToken = await generateOpaqueToken(req.user)
    res.setHeader('Authorization', accessToken)
    res.status(200).json({ refreshToken })
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
