const Router = require('express')

const Category = require('../entities/Category')
const db = require('../infrastructure/database/index')

const router = Router()

router.get('/', (req, res, next) => {
  try {
    res.status(200).json({ message: 'category endpoint !' })
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
    await transaction.commit()

    res.status(201).json(result)
  } catch (error) {
    if (transaction) await transaction.rollback()
    next(error)
  }
})

module.exports = router
