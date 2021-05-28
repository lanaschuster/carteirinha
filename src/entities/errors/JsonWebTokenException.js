class JsonWebTokenException extends Error {
  constructor(contentType) {
    super(`Invalid token`)
    this.name = 'JsonWebToken'
    this.code = '3'
  }
}

module.exports = JsonWebTokenException
