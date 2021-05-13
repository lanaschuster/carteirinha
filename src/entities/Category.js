const CategoryRepository = require('../infrastructure/database/index').category


class Category {
  constructor({ id, description, name, createdAt, updatedAt, version }) {
    this.id = id
    this.description = description
    this.name = name
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.version = version
  }

  add() {
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

  findById() {
    // TODO
  }

  findAll() {
    // TODO
  }

  find() {
    // TODO busca paginada
  }
}

module.exports = Category
