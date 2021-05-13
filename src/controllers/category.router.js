const Router = require('express')

const Category = require('../entities/Category')
const db = require('../infrastructure/database/index')

const router = Router()

router.get('/', (req, res) => {
  try {
    res.status(200).json({ message: 'category endpoint !' })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/', async (req, res) => {
  let transaction
  
  try {
    transaction = await db.sequelize.transaction()
    const category = new Category(req.body)
    const result = await category.add()
    await transaction.commit()

    res.status(201).json(result)
  } catch (error) {
    if (transaction) await transaction.rollback()
    res.status(400).send(error)
  }
})

module.exports = router
