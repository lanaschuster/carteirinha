const categoryRouter = require('./category.router')

const routes = (app) => {
  app.use('/api/categories', categoryRouter)
}

module.exports = routes
