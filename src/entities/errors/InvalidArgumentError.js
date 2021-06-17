class InvalidArgumentError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidArgument'
    this.code = '0'
  }
}

module.exports = InvalidArgumentError
