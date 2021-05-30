class InvalidContentTypeError extends Error {
  constructor(contentType) {
    super(`Format given on 'Content-Type' header not accepted: ${contentType}`)
    this.name = 'InvalidContentType'
    this.code = '1'
  }
}

module.exports = InvalidContentTypeError
