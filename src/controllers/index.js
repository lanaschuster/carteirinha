const categoryRouter = require('./category.router')
const userRouter = require('./user.router')
const authRouter = require('./auth.router')

const { MimeType, Serializer } = require('../infrastructure/http/serializer')
const NotFoundException = require('../entities/errors/NotFoundException')
const InvalidArgumentException = require('../entities/errors/InvalidArgumentException')
const InvalidContentTypeException = require('../entities/errors/InvalidContentTypeException')

const authMiddleware = require('../infrastructure/auth/middleware')

const routes = (app) => {

  /* intercept */
  app.use((req, res, next) => {
    const contentType = req.header('Accept')

    if (Object.values(MimeType).indexOf(contentType) === -1) {
      throw new InvalidContentTypeException(contentType)
    }

    res.setHeader('Content-Type', contentType)
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
  })

  /* routes */
  app.use('/api/categories', authMiddleware.bearer, categoryRouter)
  app.use('/api/users', userRouter)
  app.use('/auth', authRouter)

  
  /* error handler */
  app.use('*', (req, res, next) => {
    throw new NotFoundException('Resource')
  })
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
