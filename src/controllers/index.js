const categoryRouter = require('./category.router')
const NotFoundException = require('../entities/errors/NotFoundException')
const InvalidArgumentException = require('../entities/errors/InvalidArgumentException')
const InvalidContentTypeException = require('../entities/errors/InvalidContentTypeException')
const { MimeType } = require('../infrastructure/http/serializer')

const routes = (app) => {
  app.use((req, res, next) => {
    const contentType = req.header('Accept')

    if (Object.values(MimeType).indexOf(contentType) === -1) {
      throw new InvalidContentTypeException(contentType)
    }

    res.setHeader('Content-Type', contentType)
    next()
  })

  app.use('/api/categories', categoryRouter)
  
  /* error handler */
  app.use((error, req, res, next) => {
    if (error instanceof NotFoundException) {
      res.status(404).json({
        message: error.message,
        code: error.code
      })
    } else if (error instanceof InvalidArgumentException) {
      res.status(400).json({
        message: error.message,
        code: error.code
      })
    } else if (error instanceof InvalidContentTypeException) {
      res.status(406).json({
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
