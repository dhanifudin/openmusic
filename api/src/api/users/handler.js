class UsersHandler {
  constructor (service) {
    this.service = service

    this.postUserHandler = this.postUserHandler.bind(this)
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this)
  }

  async postUserHandler (request, h) {
    const { username, password, fullname } = request.payload

    const userId = await this.service.addUser({
      username,
      password,
      fullname
    })

    return h
      .response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId
        }
      })
      .code(201)
  }

  async getUserByIdHandler (request) {
    const { id } = request.params
    const user = await this.service.getUserById(id)
    return {
      status: 'success',
      data: {
        user
      }
    }
  }
}

module.exports = UsersHandler
