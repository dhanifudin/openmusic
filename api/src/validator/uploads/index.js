const Boom = require('@hapi/boom')
const { ImageHeaderSchema } = require('./schema')

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeaderSchema.validate(headers)

    if (validationResult.error) {
      throw Boom.badRequest()
    }
  }
}

module.exports = UploadsValidator
