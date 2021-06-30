const Router = require('express')

const User = require('../entities/User')
const db = require('../infrastructure/database/setup')
const { Serializer } = require('../infrastructure/http/serializer')

const router = Router()

/**
 * @swagger
 * /public/users:
 *  post:
 *    summary: Create a new user
 *    tags: [Public Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      201:
 *        description: user created
 *      401:
 *        description: not authorized
 *      500:
 *        description: internal server error
 */
router.post('/', async (req, res, next) => {
  let transaction
  
  try {
    transaction = await db.sequelize.transaction()
    const user = new User(req.body)
    const result = await user.add()
    
    const serializer = new Serializer(res.getHeader('Content-Type'))
    res.status(201).send(serializer.serialize(result))

    await transaction.commit()
  } catch (error) {
    if (transaction) await transaction.rollback()
    next(error)
  }
})

/**
 * @swagger
 * /public/users/check-email/{token}:
 *  get:
 *    summary: Verify the user email
 *    tags: [Public Users]
 *    parameters:
 *      - in: path
 *        name: token
 *        schema:
 *          type: string
 *        required: true
 *        description: the token sent to user email
 *    responses:
 *      200:
 *        description: page of users
 *      401:
 *        description: not authorized
 *      500:
 *        description: internal server error
 */
router.get('/check-email/:token', async (req, res, next) => {
  let transaction
  
  try {
    transaction = await db.sequelize.transaction()
    const result = await User.verifyEmail(req.params.token)
    
    const serializer = new Serializer(res.getHeader('Content-Type'))
    res.status(200).send(serializer.serialize(result))

    await transaction.commit()
  } catch (error) {
    if (transaction) await transaction.rollback()
    next(error)
  }
})

/**
 * @swagger
 * tags:
 *   name: Public Users
 *   description: API pública para cadastro e verificação de e-mail de usuários
 * components:
 *   schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - lastName
 *          - email
 *          - password
 *        properties:
 *          id:
 *            type: integer
 *            description: auto-generated id
 *          name:
 *            type: string
 *          lastName:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          isEmailVerified:
 *            type: integer
 *            description: Has value 1 if the user verified its email. Default value = 0
 *          isActive:
 *            type: integer
 *            description: Has value 0 if the user is blocked. Default value = 1
 *          avatar:
 *             type: string
 *             description: user's avatar
 */
module.exports = router
