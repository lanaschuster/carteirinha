class InvalidArgumentException extends Error {
  constructor(argument) {
    super(`the argument '${argument}' is invalid`)
    this.name = 'InvalidArgument'
    this.code = '0'
  }
}

module.exports = InvalidArgumentException
