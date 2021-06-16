const Router = require('express')
const authMiddleware = require('../infrastructure/auth/middleware')
const blocklist = require('../../redis/accessTokenBlocklist')

const InternalServerError = require('../entities/errors/InternalServerError')

const { generateJwt } = require('../infrastructure/auth/jwt')
const { generateOpaqueToken } = require('../infrastructure/auth/refreshToken')


const router = Router()

router.post('/login', authMiddleware.local, login)
router.post('/refresh', authMiddleware.refresh, login)

router.post('/logout', 
  authMiddleware.refresh, 
  authMiddleware.bearer, 
  async (req, res, next) => {
    try {
      const token = req.token
      await blocklist.add(token)
      res.status(204).send()
    } catch (error) {
      throw new InternalServerError(error.message)
    }
})

async function login(req, res, next) {
  try {
    const accessToken = generateJwt(req.user)
    const refreshToken = await generateOpaqueToken(req.user)
    res.setHeader('Authorization', accessToken)
    res.status(200).json({ refreshToken })
  } catch (error) {
    throw new InternalServerError(error.message)
  }
}

module.exports = router
