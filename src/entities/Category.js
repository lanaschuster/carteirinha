const CategoryRepository = require('../infrastructure/database/index').category
const InvalidArgumentException = require('../entities/errors/InvalidArgumentException')

class Category {
  constructor({ id, description, name, createdAt, updatedAt, version }) {
    this.id = id
    this.description = description
    this.name = name
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.version = version
  }

  validate() {
    const fields = ['name', 'description']
    fields.forEach(field => {
      const value = this[field]

      if (typeof value !== 'string' || value.length === 0) {
        throw new InvalidArgumentException(field)
      }
    })
  }

  add() {
    this.validate()
    return CategoryRepository.create({
      description: this.description,
      name: this.name
    }).then(r => {
      return Promise.resolve({ id: r.id })
    }).catch(err => {
      return Promise.reject(err)
    })
  }

  update() {
    // TODO
  }

  remove() {
    // TODO
  }

  static findById() {
    // TODO
  }

  static async findAll() {
    return await CategoryRepository.findAll()
  }

  static find() {
    // TODO busca paginada
  }
}

module.exports = Category
