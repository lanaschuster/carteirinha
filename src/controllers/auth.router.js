const Router = require('express')
const authMiddleware = require('../infrastructure/auth/middleware')
const TokenFactory = require('../infrastructure/tokens/TokenFactory')
const InternalServerError = require('../entities/errors/InternalServerError')


const router = Router()

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: Realiza login do usuário
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Credentials'
 *    responses:
 *      200:
 *        description: ok, returns the accessToken (header) and refreshToken (body)
 *      401:
 *        description: not authorized
 *      500:
 *        description: internal server error
 */
router.post('/login', authMiddleware.local, login)

/**
 * @swagger
 * /auth/refresh:
 *  post:
 *    summary: Refresh dos tokens
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RefreshToken'
 *    responses:
 *      200:
 *        description: ok, returns a new accessToken (header) and refreshToken (body)
 *      401:
 *        description: not authorized
 *      500:
 *        description: internal server error
 */
router.post('/refresh', authMiddleware.refresh, login)

/**
 * @swagger
 * /auth/logout:
 *  post:
 *    summary: Realiza logout do usuário
 *    tags: [Auth]
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RefreshToken'
 *    responses:
 *      204:
 *        description: no content
 *      401:
 *        description: not authorized
 *      500:
 *        description: internal server error
 */
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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API para autenticação e autorização
 * components:
 *    schemas:
 *      Credentials:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
 *      RefreshToken:
 *        type: object
 *        required:
 *          - refreshToken
 *        properties:
 *          refreshToken:
 *            type: string
 */
module.exports = router
