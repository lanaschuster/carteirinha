const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy

const EncoderAdapter = require('../adapters/EncoderAdapter')
const TokenFactory = require('../tokens/TokenFactory')
const User = require('../../entities/User')
const blocklist = require('../../../redis/accessTokenBlocklist')
const InvalidArgumentError = require('../../entities/errors/InvalidArgumentError')

const validateUser = user => {
  if (!user) throw new InvalidArgumentError('email or password')
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
        const encoder = new EncoderAdapter()
        const user = await User.findByEmail(email)
        validateUser(user)
        await encoder.compare(password, user.password)

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
        await blocklist.checkToken(token)
        const jwt = TokenFactory.create('JWT')
        const payload = jwt.verify(token)
        const user = await User.findById(payload.id)
        done(null, user, { token })
      } catch (error) {
        done(error)
      }      
    }
  )
)
