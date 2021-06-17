const bcrypt = require('bcrypt')
const InvalidArgumentError = require('../../entities/errors/InvalidArgumentError')

class EncoderAdapter {
  constructor(saltRounds = 12) {
    this._saltRounds = saltRounds
  }

  get saltRounds() {
    return this._saltRounds
  }

  async encode(password) {
    const hash = await bcrypt.hash(password, this.saltRounds)
    return hash
  }

  async compare(password, hash) {
    const isValid = await bcrypt.compare(password, hash)
    if (!isValid) {
      throw new InvalidArgumentError('password or email are incorrect or invalid')
    }
  }
}

module.exports = EncoderAdapter
