const Router = require('express')
const authMiddleware = require('../infrastructure/auth/middleware')
const TokenFactory = require('../infrastructure/tokens/TokenFactory')
const InternalServerError = require('../entities/errors/InternalServerError')


const router = Router()

router.post('/login', authMiddleware.local, login)
router.post('/refresh', authMiddleware.refresh, login)

router.post('/logout', 
  authMiddleware.refresh, 
  authMiddleware.bearer, 
  async (req, res, next) => {
    try {
      const token = req.token
      const jwt = TokenFactory.create('JWT')
      await jwt.invalidate(token)
      res.status(204).send()
    } catch (error) {
      throw new InternalServerError(error.message)
    }
})

async function login(req, res, next) {
  try {
    const jwt = TokenFactory.create('JWT')
    const refreshTokenUtils = TokenFactory.create('REFRESH') 

    const accessToken = await jwt.generate(req.user.id, [1, 'h'])
    const refreshToken = await refreshTokenUtils.generate(req.user.id, [5, 'd'])
    res.setHeader('Authorization', accessToken)
    res.status(200).json({ refreshToken })
  } catch (error) {
    throw new InternalServerError(error.message)
  }
}

module.exports = router
