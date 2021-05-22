const InvalidContentTypeException = require('../../entities/errors/InvalidContentTypeException')

const MimeType = {
  ALL: '*/*',
  APPLICATION_JSON: 'application/json'
}

class Serializer {
  constructor(contentType) {
    this.contentType = contentType
  }

  json (data) {
    return JSON.stringify(data)
  }

  serialize (data) {
    if (this.contentType === MimeType.ALL) {
      return this.json(data)
    }

    if (this.contentType === MimeType.APPLICATION_JSON) {
      return this.json(data)
    }

    throw new InvalidContentTypeException(this.contentType)
  }
}

module.exports = {
  Serializer,
  MimeType,
}