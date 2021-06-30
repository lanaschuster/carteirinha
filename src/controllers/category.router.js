const Router = require('express')

const Category = require('../entities/Category')
const db = require('../infrastructure/database/setup')
const { Serializer } = require('../infrastructure/http/serializer')
const InvalidArgumentError = require('../entities/errors/InvalidArgumentError')

const router = Router()

router.options('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200).end() // some legacy browsers (IE11, various SmartTVs) choke on 204
})

router.options('/:id', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200).end()
})

/**
 * @swagger
 * /api/categories:
 *  get:
 *    summary: Get category page
 *    tags: [Categories]
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
 *        description: page of categories
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

    const list = await Category.find(page, size, sort, direction, filter)
    const serializer = new Serializer(res.getHeader('Content-Type'))
    res.status(200).send(serializer.serialize(list))
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/categories/{id}:
 *  get:
 *    summary: Get category by id
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        description: the category id
 *        required: true
 *    responses:
 *      200:
 *        description: ok
 *      401:
 *        description: not authorized
 *      500:
 *        description: internal server error
 */
router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    const serializer = new Serializer(res.getHeader('Content-Type'))
    res.status(200).send(serializer.serialize(category))
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/categories:
 *  post:
 *    summary: Create a new category
 *    tags: [Categories]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
 *    responses:
 *      201:
 *        description: category created
 *      401:
 *        description: not authorized
 *      500:
 *        description: internal server error
 */
router.post('/', async (req, res, next) => {
  let transaction
  
  try {
    transaction = await db.sequelize.transaction()
    const category = new Category(req.body)
    const result = await category.add()
    
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
 * /api/categories/{id}:
 *  put:
 *    summary: Update category's data
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: the category id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
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
    const category = new Category(req.body)
    category.id = req.params.id
    await category.update()
    
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
 *   name: Categories
 *   description: API para cadastro de categoria de despesas e incomings
 * components:
 *   schemas:
 *      Category:
 *        type: object
 *        required:
 *          - name
 *          - type
 *          - description
 *        properties:
 *          id:
 *            type: integer
 *            description: auto-generated id
 *          name:
 *            type: string
 *          description:
 *            type: string
 *          type:
 *            type: string
 *            description: value can be EXPENSE or INCOMING
 */
module.exports = router
