class NotFoundException extends Error {
  constructor(entityName) {
    super(`'${entityName}' not found`)
    this.name = 'NotFound'
    this.code = '404'
  }
}

module.exports = NotFoundException
