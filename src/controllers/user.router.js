const Router = require('express')
const User = require('../entities/User')
const db = require('../infrastructure/database/setup')
const { Serializer } = require('../infrastructure/http/serializer')
const InvalidArgumentError = require('../entities/errors/InvalidArgumentError')

const router = Router()

router.options('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200).end()
})

router.options('/:id', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200).end()
})

/**
 * @swagger
 * /api/users:
 *  get:
 *    summary: Get users page
 *    tags: [Users]
 *    parameters:
 *      - in: query
 *        name: page
 *        type: integer
 *        description: the page number (begins with 1)
 *        minimum: 1
 *        required: true
 *      - in: query
 *        name: size
 *        type: integer
 *        description: number of items per page
 *        default: 5
 *      - in: query
 *        name: sort
 *        type: string
 *        description: field to be sorted by
 *        default: name
 *      - in: query
 *        name: direction
 *        type: string
 *        description: direction of sorting (ASC or DESC)
 *        default: ASC
 *      - in: query
 *        name: filter
 *        type: string
 *        description: search items where value like filter
 *    responses:
 *      200:
 *        description: page of users
 *      401:
 *        description: not authorized
 *      500:
 *        description: internal server error
 */
router.get('/', async (req, res, next) => {
  try {
    if (!req.query.page) {
      throw new InvalidArgumentError('\'page\' query not provided')
    }

    const page = req.query.page
    const size = req.query.size
    const sort = req.query.sort
    const direction = req.query.direction
    const filter = req.query.filter

    const list = await User.find(page, size, sort, direction, filter)
    const serializer = new Serializer(res.getHeader('Content-Type'))
    res.status(200).send(serializer.serialize(list))
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *    summary: Get user by id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        description: the user id
 *        required: true
 *    responses:
 *      200:
 *        description: page of users
 *      401:
 *        description: not authorized
 *      500:
 *        description: internal server error
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    const serializer = new Serializer(res.getHeader('Content-Type'))
    res.status(200).send(serializer.serialize(user))
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/users:
 *  post:
 *    summary: Create a new user
 *    tags: [Users]
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
 * /api/users/{id}:
 *  put:
 *    summary: Update user's data
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: the user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      204:
 *        description: no content
 *      401:
 *        description: not authorized
 *      500:
 *        description: internal server error
 */
router.put('/:id', async (req, res, next) => {
  let transaction
  
  try {
    transaction = await db.sequelize.transaction()
    const user = new User(req.body)
    user.id = req.params.id
    await user.update()
    
    res.status(204).send()

    await transaction.commit()
  } catch (error) {
    if (transaction) await transaction.rollback()
    next(error)
  }
})

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API privada para gerenciamento de usuários
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
