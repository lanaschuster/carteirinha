const UserRepository = require('../infrastructure/database/setup').user
const InvalidArgumentError = require('./errors/InvalidArgumentError')

const bcrypt = require('bcrypt') // TODO: remove dep from model

class User {
  constructor({ id, name, lastName, email, password, avatar, createdAt, updatedAt, version }) {
    this.id = id
    this.name = name
    this.lastName = lastName
    this.email = email
    this.password = password
    this.avatar = avatar
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.version = version
  }

  async validate() {
    const fields = ['name', 'lastName', 'email', 'password']
    fields.forEach(field => {
      const value = this[field]

      if (typeof value !== 'string' || value.length === 0) {
        throw new InvalidArgumentError(field)
      }
    })

    const exists = await User.findByEmail(this.email)
    if (exists) {
      throw new InvalidArgumentError('email')
    }
  }

  async add() {
    await this.validate()
    return UserRepository.create({
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      password: await User.encodePassword(this.password),
      avatar: this.avatar
    }).then(r => {
      return Promise.resolve({ id: r.id })
    }).catch(err => {
      return Promise.reject(err)
    })
  }

  static async encodePassword(password) {
    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(password, salt)
    return hash
  }

  static async findAll() {
    return await UserRepository.findAll({ raw: true })
  }

  static async findByEmail(email) {
    return await UserRepository.findOne({ 
      where: { email: email },
      raw: true 
    })
  }

  static async findById(id) {
    return await UserRepository.findOne({ 
      where: { id: id },
      raw: true 
    })
  }
}

module.exports = User