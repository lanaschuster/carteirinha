const categoryRouter = require('./category.router')
const NotFoundException = require('../entities/errors/NotFoundException')
const InvalidArgumentException = require('../entities/errors/InvalidArgumentException')
const InvalidContentTypeException = require('../entities/errors/InvalidContentTypeException')
const { MimeType, Serializer } = require('../infrastructure/http/serializer')

const routes = (app) => {
  /* intercept */
  app.use((req, res, next) => {
    const contentType = req.header('Accept')

    if (Object.values(MimeType).indexOf(contentType) === -1) {
      throw new InvalidContentTypeException(contentType)
    }

    res.setHeader('Content-Type', contentType)
    next()
  })

  /* routes */
  app.use('/api/categories', categoryRouter)
  
  /* error handler */
  app.use((error, req, res, next) => {
    const serializer = new Serializer(res.getHeader('Content-Type'))

    if (error instanceof NotFoundException) {
      res.status(404)
    } else if (error instanceof InvalidArgumentException) {
      res.status(400)
    } else if (error instanceof InvalidContentTypeException) {
      res.status(406)
    } else {
      res.status(400)
    }

    res.send(serializer.serialize({
      message: error.message,
      code: error.code
    }))
  })
}

module.exports = routes
