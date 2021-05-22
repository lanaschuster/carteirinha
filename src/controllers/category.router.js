const Router = require('express')

const Category = require('../entities/Category')
const db = require('../infrastructure/database/setup')
const { Serializer } = require('../infrastructure/http/serializer')

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const list = await Category.findAll()
    const serializer = new Serializer(res.getHeader('Content-Type'))
    res.status(200).send(serializer.serialize(list))
  } catch (error) {
    next(error)
  }
})

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

module.exports = router
