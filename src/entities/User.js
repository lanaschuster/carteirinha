const { Op } = require('sequelize')
const UserRepository = require('../infrastructure/database/setup').user
const InvalidArgumentError = require('./errors/InvalidArgumentError')

const TokenFactory = require('../infrastructure/tokens/TokenFactory')
const EncoderAdapter = require('../infrastructure/adapters/EncoderAdapter')
const EmailConfirmationMailer = require('../infrastructure/mail/EmailConfirmationMailer')

class User {
  constructor({ id, name, lastName, email, password, avatar, createdAt, updatedAt, version, isActive }) {
    this.id = id
    this.name = name
    this.lastName = lastName
    this.email = email
    this.password = password
    this.avatar = avatar
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.version = version
    this.isActive = isActive
  }

  async validate() {
    const fields = ['name', 'lastName', 'email', 'password']
    fields.forEach(field => {
      const value = this[field]

      if (typeof value !== 'string' || value.length === 0) {
        throw new InvalidArgumentError(`the field ${field} is invalid`)
      }
    })

    const exists = await User.findByEmail(this.email)
    if (exists) {
      throw new InvalidArgumentError(`the field 'email' is invalid`)
    }
  }

  async add() {
    await this.validate()
    const encoder = new EncoderAdapter()

    return UserRepository.create({
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      password: await encoder.encode(this.password),
      avatar: this.avatar,
      isEmailVerified: 0,
      isActive: 1
    }).then(r => {
      const token = TokenFactory.create('JWT').generate(r.id, [1, 'h'])
      EmailConfirmationMailer.send(r.email, token)
      return Promise.resolve({ id: r.id })
    }).catch(err => {
      return Promise.reject(err)
    })
  }

  update() {
    return UserRepository.findOne({
      where: { id: this.id },
    }).then(async r => {
      if (r) {
        r.name = this.name ? this.name : r.name
        r.lastName = this.lastName ? this.lastName : r.lastName
        r.type = this.type ? this.type : r.type
        r.avatar = this.avatar ? this.avatar : r.avatar
        r.isActive = this.isActive != undefined ? this.isActive : r.isActive
        
        if (this.password) {
          const encoder = new EncoderAdapter()
          r.password = await encoder.encode(this.password)
        }
  
        await r.save()
      }

      return Promise.resolve()
    }).catch(err => {
      return Promise.reject(err)
    })  
  }

  static async verifyEmail(token) {
    const payload = TokenFactory.create('JWT').verify(token)

    return await UserRepository.findOne({ 
      where: { id: payload.id },
    })
    .then(async r => {
      r.isEmailVerified = 1
      await r.save()
      return Promise.resolve()
    })
    .catch(err => {
      return Promise.reject(err)
    })
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

  static find(page, size = 5, sort = 'name', direction = 'ASC', filter = undefined) {
    const offset = size * (page-1)
    const condition = !filter 
      ? undefined
      : {
          [Op.or]: [
            {
              name: { [Op.like]: `%${filter}%` }
            },
            {
              lastName: { [Op.like]: `%${filter}%`}
            },
            {
              email: { [Op.like]: `%${filter}%`}
            }
          ]
        }

    return UserRepository.findAndCountAll({
        raw: true,
        where: condition,
        offset: offset,
        limit: +size,
        order: [
          [sort, direction]
        ]
      })
      .then(users => {
        const pages = Math.ceil(users.count / size)
        return {
          pages,
          count: users.count,
          result: users.rows
        }
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}

module.exports = User
