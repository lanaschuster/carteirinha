/**
 * 
 * Arquivo de configuração do Express
 */
require('reflect-metadata')
const express = require('express')
const morgan = require('morgan')

const routes = require('./controllers/index')

const app = express()
app.use(express.json())
app.use(morgan('dev'))


routes(app)

module.exports = app
