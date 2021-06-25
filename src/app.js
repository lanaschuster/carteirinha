/**
 * 
 * Arquivo de configuração do Express
 */
require('reflect-metadata')
const express = require('express')
const morgan = require('morgan')
const passport = require('passport')

const swaggerConfig = require('./swagger')
const routes = require('./controllers/index')
require('./infrastructure/auth')

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(passport.initialize())
app.use(
  swaggerConfig.docUrl,
  swaggerConfig.serve,
  swaggerConfig.setup
)

routes(app)

module.exports = app
