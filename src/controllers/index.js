const categoryRouter = require('./category.router')
const userRouter = require('./user.router')
const userPublicRouter = require('./user.public.router')
const authRouter = require('./auth.public.router')

const { MimeType, Serializer } = require('../infrastructure/http/serializer')
const NotFoundError = require('../entities/errors/NotFoundError')
const InvalidArgumentError = require('../entities/errors/InvalidArgumentError')
const InvalidContentTypeError = require('../entities/errors/InvalidContentTypeError')
const InternalServerError = require('../entities/errors/InternalServerError')


const authMiddleware = require('../infrastructure/auth/middleware')

const routes = (app) => {

  /* intercept */
  app.use((req, res, next) => {
    const contentType = req.header('Accept')

    if (Object.values(MimeType).indexOf(contentType) === -1) {
      throw new InvalidContentTypeError(contentType)
    }

    res.setHeader('Content-Type', contentType)
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
  })

  /* routes */
  app.use('/api/categories', authMiddleware.bearer, categoryRouter)
  app.use('/api/users', authMiddleware.bearer, userRouter)
  app.use('/public/users', userPublicRouter)
  app.use('/public/auth', authRouter)

  
  /* error handler */
  app.use('*', (req, res, next) => {
    throw new NotFoundError('Resource')
  })
  app.use((error, req, res, next) => {
    const serializer = new Serializer(res.getHeader('Content-Type'))

    if (error instanceof NotFoundError) {
      res.status(404)
    } else if (error instanceof InvalidArgumentError) {
      res.status(400)
    } else if (error instanceof InvalidContentTypeError) {
      res.status(406)
    } else if (error instanceof InternalServerError) {
      res.status(500)
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
