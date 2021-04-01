require('reflect-metadata')
const express = require('express')
const morgan = require('morgan')
// const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const cors = require('cors')

// const routes = require('./controllers/routes')

// import { initPassport } from './infrastructure/passport/index'
// initPassport(passport)


const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(flash())
app.use(cors())


app.use(
  session({
    secret: '__c4rt3irinh4_s3ss10n',
    resave: true,
    saveUninitialized: true
  })
)

// app.use(passport.initialize())
// app.use(passport.session())

// routes(app)

module.exports = app