const categoryRouter = require('./category.router')
const NotFoundException = require('../entities/errors/NotFoundException')

const routes = (app) => {
  app.use('/api/categories', categoryRouter)
  
  app.use((error, req, res, next) => {
    if (error instanceof NotFoundException) {
      res.status(404).json({
        message: error.message,
        code: error.code
      })
    } else {
      res.status(400).json({
        message: error.message,
        code: error.code
      })
    }
  })
}

module.exports = routes
