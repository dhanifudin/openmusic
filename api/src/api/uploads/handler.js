class UploadsHandler {
  constructor (service, validator) {
    this.service = service
    this.validator = validator

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this)
  }

  async postUploadImageHandler (request, h) {
    const { data } = request.payload
    this.validator.validateImageHeaders(data.hapi.headers)

    const pictureUrl = await this.service.writeFile(data, data.hapi)

    const response = h.response({
      status: 'success',
      message: 'Gambar berhasil diunggah',
      data: {
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/uploads/${pictureUrl}`
      }
    })
    response.code(201)
    return response
  }
}

module.exports = UploadsHandler
