const bcrypt = require('bcrypt') // TODO: tirar bcrypt daqui!
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy

const TokenFactory = require('../tokens/TokenFactory')
const User = require('../../entities/User')
const InvalidArgumentError = require('../../entities/errors/InvalidArgumentError')

const blocklist = require('../../../redis/accessTokenBlocklist')

const validateUser = user => {
  if (!user) throw new InvalidArgumentError('email or password')
}

const checkPassword = async (providedPassword, userPassword) => {
  const isValid = await bcrypt.compare(providedPassword, userPassword)

  if (!isValid) {
    throw new InvalidArgumentError('email or password')
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
