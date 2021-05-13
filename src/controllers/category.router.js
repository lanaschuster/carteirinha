const Router = require('express')

const router = Router()

router.get('/', (req, res) => {
  try {
    res.status(200).json({ message: 'endpoint category!' })
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = router
