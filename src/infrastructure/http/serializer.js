const { x } = require('joi')
const jsontoxml = require('jsontoxml')
const InvalidContentTypeException = require('../../entities/errors/InvalidContentTypeException')

const MimeType = {
  ALL: '*/*',
  APPLICATION_JSON: 'application/json',
  APPLICATION_XML: 'application/xml',
}

class Serializer {
  constructor(contentType) {
    this.contentType = contentType
  }

  json (data) {
    return JSON.stringify(data)
  }

  xml(data, tag = 'entity') {
    return jsontoxml({ [tag]: {...data} })
  }

  serialize (data) {
    if (this.contentType === MimeType.ALL) {
      return this.json(data)
    }

    if (this.contentType === MimeType.APPLICATION_JSON) {
      return this.json(data)
    }

    if (this.contentType === MimeType.APPLICATION_XML) {
      return this.xml(data)
    }

    throw new InvalidContentTypeException(this.contentType)
  }
}

module.exports = {
  Serializer,
  MimeType,
}