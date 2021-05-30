const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy

const User = require('../../entities/User')
const InvalidArgumentError = require('../../entities/errors/InvalidArgumentError')

const blacklist = require('../../../redis/blacklistController')

const validateUser = user => {
  if (!user) throw new InvalidArgumentError('email or password')
}

const checkPassword = async (providedPassword, userPassword) => {
  const isValid = await bcrypt.compare(providedPassword, userPassword)

  if (!isValid) {
    throw new InvalidArgumentError('email or password')
  }
}

const checkBlacklist = async token => {
  const blacklistToken = await blacklist.hasToken(token)
  if (blacklistToken) {
    throw new jwt.JsonWebTokenError('token invalid by logout')
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    async (email, password, done) => {
      try {
        const user = await User.findByEmail(email)
        validateUser(user)
        await checkPassword(password, user.password)

        done(null, user)
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.use(
  new BearerStrategy(
    async (token, done) => {
      try {
        await checkBlacklist(token)
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(payload.id)
        done(null, user, { token })
      } catch (error) {
        done(error)
      }      
    }
  )
)
