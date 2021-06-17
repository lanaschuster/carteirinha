const passport = require('passport')
const TokenFactory = require('../tokens/TokenFactory')
const User = require('../../entities/User')

module.exports = {
  local: (req, res, next) => {
    passport.authenticate(
      'local',
      { session: false },
      (error, user, info) => {
        if (error && error.name === 'InvalidArgumentError') {
          return res.status(400).json({ error: error.message })
        }

        if (error) {
          return res.status(500).json({ error: error.message })
        }

        if (!user) {
          return res.status(401).json()
        }

        req.user = user
        return next()
      }
    )(req, res, next)
  },

  bearer: (req, res, next) => {
    passport.authenticate(
      'bearer',
      { session: false },
      (error, user, info) => {
        if (error && error.name === 'JsonWebTokenError') {
          return res.status(401).json({ error: error.message })
        }

        if (error && error.name === 'TokenExpiredError') {
          return res.status(401).json({ error: error.message, expiredAt: error.expiredAt })
        }

        if (error) {
          return res.status(500).json({ error: error.message })
        }
        
        if (!user) {
          return res.status(401).json()
        }

        req.token = info.token
        req.user = user
        return next()
      }
    )(req, res, next)
  },

  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      const refreshTokenUtils = TokenFactory.create('REFRESH')
      const id = await refreshTokenUtils.verify(refreshToken)
      await refreshTokenUtils.invalidate(refreshToken)
      req.user = await User.findById(id)
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
