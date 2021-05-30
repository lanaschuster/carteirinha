const CategoryRepository = require('../infrastructure/database/setup').category
const InvalidArgumentError = require('./errors/InvalidArgumentError')
const NotFoundError = require('./errors/NotFoundError')

class Category {
  constructor({ id, description, name, type, createdAt, updatedAt, version }) {
    this.id = id
    this.description = description
    this.name = name
    this.type = type
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.version = version
  }

  validate() {
    const fields = ['name', 'description', 'type']
    fields.forEach(field => {
      const value = this[field]

      if (typeof value !== 'string' || value.length === 0) {
        throw new InvalidArgumentError(field)
      }
    })
  }

  add() {
    this.validate()
    return CategoryRepository.create({
      description: this.description,
      name: this.name,
      type: this.type
    }).then(r => {
      return Promise.resolve({ id: r.id })
    }).catch(err => {
      return Promise.reject(err)
    })
  }

  update() {
    this.validate()
    return CategoryRepository.findOne({
      where: { id: this.id },
    }).then(async r => {
      if (r) {
        r.description = this.description
        r.name = this.name
        r.type = this.type
  
        await r.save()
      }

      return Promise.resolve()
    }).catch(err => {
      return Promise.reject(err)
    })
  }

  remove() {
    // TODO
  }

  static findById(id) {
    return CategoryRepository.findOne({
      where: { id: id },
      raw: true
    }).then(r => {
      if (!r) 
        throw new NotFoundError('Category')
      
      const result = {
        id: r.id,
        description: r.description,
        name: r.name,
        type: r.type
      }

      return Promise.resolve(result)
    }).catch(err => {
      return Promise.reject(err)
    })
  }

  static async findAll() {
    return await CategoryRepository.findAll({ raw: true })
  }

  static find() {
    // TODO busca paginada
  }
}

module.exports = Category
