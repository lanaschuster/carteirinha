const Router = require('express')

const User = require('../entities/User')
const db = require('../infrastructure/database/setup')
const { Serializer } = require('../infrastructure/http/serializer')

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const list = await User.findAll()
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

module.exports = router
